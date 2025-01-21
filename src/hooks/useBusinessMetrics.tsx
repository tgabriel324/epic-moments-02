import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessMetrics {
  stampCount: number;
  totalViews: number;
  totalInteractions: number;
  averageInteractionTime: number;
  monthlyData: {
    month: string;
    views: number;
    interactions: number;
  }[];
  qrCodeMetrics: {
    stampId: string;
    stampName: string;
    views: number;
    interactions: number;
    averageTime: number;
  }[];
}

export function useBusinessMetrics() {
  return useQuery({
    queryKey: ["business-metrics"],
    queryFn: async (): Promise<BusinessMetrics> => {
      console.log("Fetching business metrics...");
      
      // Buscar métricas gerais
      const { data: metricsData, error: metricsError } = await supabase
        .from("usage_metrics")
        .select("*")
        .order("month_year", { ascending: false })
        .limit(6);

      if (metricsError) {
        console.error("Erro ao buscar métricas:", metricsError);
        throw new Error("Falha ao carregar métricas");
      }

      // Buscar contagem de estampas
      const { count: stampCount, error: stampError } = await supabase
        .from("stamps")
        .select("*", { count: 'exact', head: true });

      if (stampError) {
        console.error("Erro ao buscar contagem de estampas:", stampError);
        throw new Error("Falha ao carregar contagem de estampas");
      }

      // Buscar métricas por QR Code
      const { data: qrMetrics, error: qrError } = await supabase
        .from("stamps")
        .select(`
          id,
          name,
          ar_interactions (
            id,
            duration,
            status
          )
        `);

      if (qrError) {
        console.error("Erro ao buscar métricas de QR:", qrError);
        throw new Error("Falha ao carregar métricas de QR");
      }

      // Calcular métricas por QR Code
      const qrCodeMetrics = qrMetrics?.map(stamp => {
        const interactions = stamp.ar_interactions || [];
        const views = interactions.length;
        const completedInteractions = interactions.filter(i => i.status === 'completed');
        const totalDuration = completedInteractions.reduce((sum, i) => sum + (i.duration || 0), 0);
        
        return {
          stampId: stamp.id,
          stampName: stamp.name,
          views,
          interactions: completedInteractions.length,
          averageTime: completedInteractions.length > 0 
            ? Math.round(totalDuration / completedInteractions.length) 
            : 0
        };
      }) || [];

      // Calcular tempo médio geral de interação
      const allCompletedInteractions = qrCodeMetrics.reduce((sum, qr) => sum + qr.interactions, 0);
      const totalDuration = qrCodeMetrics.reduce((sum, qr) => sum + (qr.averageTime * qr.interactions), 0);
      const averageInteractionTime = allCompletedInteractions > 0 
        ? Math.round(totalDuration / allCompletedInteractions)
        : 0;

      // Processar dados mensais
      const monthlyData = metricsData.map(metric => ({
        month: new Date(metric.month_year).toLocaleDateString('pt-BR', { month: 'short' }),
        views: metric.total_views,
        interactions: metric.total_interactions
      })).reverse();

      // Calcular totais
      const totalViews = metricsData.reduce((sum, metric) => sum + (metric.total_views || 0), 0);
      const totalInteractions = metricsData.reduce((sum, metric) => sum + (metric.total_interactions || 0), 0);

      return {
        stampCount: stampCount || 0,
        totalViews,
        totalInteractions,
        averageInteractionTime,
        monthlyData,
        qrCodeMetrics
      };
    }
  });
}