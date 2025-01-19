import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Image, Video, Eye, MousePointer } from "lucide-react";

const BusinessDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalStamps: 0,
    totalVideos: 0,
    totalViews: 0,
    totalInteractions: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Buscar contagem de estampas
        const { count: stampsCount } = await supabase
          .from('stamps')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', user.id);

        // Buscar contagem de vídeos
        const { count: videosCount } = await supabase
          .from('videos')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', user.id);

        // Buscar métricas de uso
        const { data: usageData } = await supabase
          .from('usage_metrics')
          .select('total_views, total_interactions')
          .eq('business_id', user.id)
          .order('month_year', { ascending: false })
          .limit(1)
          .single();

        setMetrics({
          totalStamps: stampsCount || 0,
          totalVideos: videosCount || 0,
          totalViews: usageData?.total_views || 0,
          totalInteractions: usageData?.total_interactions || 0
        });
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <BusinessLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Acompanhe as métricas principais do seu negócio
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Estampas</CardTitle>
              <Image className="w-4 h-4 text-[#00BFFF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics.totalStamps}</div>
              <p className="text-xs text-gray-500 mt-1">Estampas cadastradas</p>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Vídeos</CardTitle>
              <Video className="w-4 h-4 text-[#00BFFF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics.totalVideos}</div>
              <p className="text-xs text-gray-500 mt-1">Vídeos vinculados</p>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Visualizações</CardTitle>
              <Eye className="w-4 h-4 text-[#00BFFF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics.totalViews}</div>
              <p className="text-xs text-gray-500 mt-1">Visualizações totais</p>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Interações</CardTitle>
              <MousePointer className="w-4 h-4 text-[#00BFFF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics.totalInteractions}</div>
              <p className="text-xs text-gray-500 mt-1">Interações totais</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessDashboard;