import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { 
  Loader2, 
  Image, 
  Video, 
  Eye, 
  MousePointer,
  TrendingUp,
  Users,
  Activity
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";
import { toast } from "sonner";

const BusinessDashboard = () => {
  const { data: metrics, isLoading, error } = useBusinessMetrics();

  useEffect(() => {
    if (error) {
      console.error("Erro ao carregar métricas:", error);
      toast.error("Erro ao carregar métricas do dashboard");
    }
  }, [error]);

  if (isLoading) {
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
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Acompanhe as métricas principais do seu negócio
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Estampas</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Image className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics?.stampCount || 0}</div>
              <div className="flex items-center mt-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>Estampas ativas</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Visualizações</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <Eye className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics?.totalViews || 0}</div>
              <div className="flex items-center mt-1 text-xs text-green-600">
                <Users className="w-3 h-3 mr-1" />
                <span>Total de visualizações</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Interações</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <MousePointer className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics?.totalInteractions || 0}</div>
              <div className="flex items-center mt-1 text-xs text-green-600">
                <Activity className="w-3 h-3 mr-1" />
                <span>Total de interações</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Taxa de Engajamento</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <TrendingUp className="w-4 h-4 text-[#00BFFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics?.totalViews ? 
                  `${((metrics.totalInteractions / metrics.totalViews) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </div>
              <div className="flex items-center mt-1 text-xs text-green-600">
                <Activity className="w-3 h-3 mr-1" />
                <span>Interações/Visualizações</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-gray-100 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Visualizações vs. Interações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics?.monthlyData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} 
                    />
                    <Bar dataKey="views" fill="#00BFFF" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="interactions" fill="#0080FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Destaques do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <TrendingUp className="w-4 h-4 text-[#00BFFF]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Taxa de Engajamento</p>
                      <p className="text-sm text-gray-600">Média do período</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">
                    {metrics?.totalViews ? 
                      `${((metrics.totalInteractions / metrics.totalViews) * 100).toFixed(1)}%` : 
                      '0%'
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <Users className="w-4 h-4 text-[#00BFFF]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Visualizações</p>
                      <p className="text-sm text-gray-600">Total do período</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">{metrics?.totalViews || 0}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <Activity className="w-4 h-4 text-[#00BFFF]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Interações</p>
                      <p className="text-sm text-gray-600">Total do período</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">{metrics?.totalInteractions || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessDashboard;