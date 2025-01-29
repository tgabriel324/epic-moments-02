import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Users, BarChart, Clock, Edit, Trash } from "lucide-react";
import { MetricsChart } from "@/components/business/metrics/MetricsChart";

const AdminPlans = () => {
  const plans = [
    {
      id: 1,
      name: "Free",
      subscribers: 450,
      revenue: "R$ 0",
      conversion: "5%",
      limits: {
        stamps: 5,
        storage: "1GB",
        support: "Email",
      }
    },
    {
      id: 2,
      name: "Pro",
      subscribers: 280,
      revenue: "R$ 8.400",
      conversion: "15%",
      limits: {
        stamps: 50,
        storage: "10GB",
        support: "Priority",
      }
    },
    {
      id: 3,
      name: "Enterprise",
      subscribers: 45,
      revenue: "R$ 4.500",
      conversion: "25%",
      limits: {
        stamps: "Unlimited",
        storage: "100GB",
        support: "24/7",
      }
    },
  ];

  const revenueData = [
    { month: "Jan", views: 10000, interactions: 8000 },
    { month: "Fev", views: 12000, interactions: 9500 },
    { month: "Mar", views: 15000, interactions: 12000 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#000000]">Planos e Assinaturas</h1>
          <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90">
            <Package className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{plan.name}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-[#00BFFF]" />
                      <span className="text-sm">Assinantes</span>
                    </div>
                    <Badge>{plan.subscribers}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-2 text-[#00BFFF]" />
                      <span className="text-sm">Conversão</span>
                    </div>
                    <Badge variant="outline">{plan.conversion}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-[#00BFFF]" />
                      <span className="text-sm">Receita</span>
                    </div>
                    <span className="font-medium">{plan.revenue}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Limites</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Estampas</span>
                        <span>{plan.limits.stamps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Armazenamento</span>
                        <span>{plan.limits.storage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Suporte</span>
                        <span>{plan.limits.support}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Receita por Plano</CardTitle>
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