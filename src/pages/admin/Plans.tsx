import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BarChart, Clock } from "lucide-react";
import { MetricsChart } from "@/components/business/metrics/MetricsChart";
import { CreatePlanDialog } from "@/components/admin/plans/CreatePlanDialog";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { DeletePlanDialog } from "@/components/admin/plans/DeletePlanDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminPlans = () => {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const revenueData = [
    { month: "Jan", views: 10000, interactions: 8000 },
    { month: "Fev", views: 12000, interactions: 9500 },
    { month: "Mar", views: 15000, interactions: 12000 },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFFF]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Planos e Assinaturas</h1>
          <CreatePlanDialog />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => (
            <Card key={plan.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold text-gray-900 capitalize">
                  {plan.name}
                </CardTitle>
                <div className="flex gap-2">
                  <EditPlanDialog plan={plan} />
                  <DeletePlanDialog planId={plan.id} planName={plan.name} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-[#00BFFF]" />
                      <span className="text-sm font-medium text-gray-600">Assinantes</span>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-[#00BFFF]" />
                      <span className="text-sm font-medium text-gray-600">Conversão</span>
                    </div>
                    <Badge variant="outline" className="text-gray-600">0%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-[#00BFFF]" />
                      <span className="text-sm font-medium text-gray-600">Receita</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(0)}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Recursos Incluídos</h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Estampas</span>
                        <span className="font-medium text-gray-900">{plan.max_stamps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Métricas Detalhadas</span>
                        <span className="font-medium text-gray-900">{plan.has_detailed_metrics ? "Sim" : "Não"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Branding Personalizado</span>
                        <span className="font-medium text-gray-900">{plan.has_custom_branding ? "Sim" : "Não"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Suporte Prioritário</span>
                        <span className="font-medium text-gray-900">{plan.has_priority_support ? "Sim" : "Não"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Relatórios Avançados</span>
                        <span className="font-medium text-gray-900">{plan.has_advanced_reports ? "Sim" : "Não"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Receita por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricsChart
              data={revenueData}
              title="Crescimento da Receita"
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPlans;