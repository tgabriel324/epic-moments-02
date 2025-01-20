import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessMetrics {
  stampCount: number;
  totalViews: number;
  totalInteractions: number;
  monthlyData: {
    month: string;
    views: number;
    interactions: number;
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
        monthlyData
      };
    }
  });
}