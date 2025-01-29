import { AdminLayout } from "@/components/layouts/AdminLayout";
import { MetricsCard } from "@/components/business/metrics/MetricsCard";
import { MetricsChart } from "@/components/business/metrics/MetricsChart";
import { Users, Activity, Package, DollarSign } from "lucide-react";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";

const AdminDashboard = () => {
  const { data: metrics, isLoading } = useBusinessMetrics();

  const chartData = metrics?.monthlyData || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#000000]">Dashboard Administrativo</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total de Usuários"
            value="1,234"
            change={20}
            icon={<Users />}
            description="Usuários ativos na plataforma"
          />

          <MetricsCard
            title="Interações AR"
            value="45,678"
            change={15}
            icon={<Activity />}
            description="Visualizações em realidade aumentada"
          />

          <MetricsCard
            title="Assinaturas Ativas"
            value="89"
            change={5}
            icon={<Package />}
            description="Empresas com planos ativos"
          />

          <MetricsCard
            title="Receita Mensal"
            value="R$ 12.345"
            change={25}
            icon={<DollarSign />}
            description="Faturamento recorrente mensal"
          />
        </div>

        <div className="grid gap-4 grid-cols-1">
          <MetricsChart
            data={chartData}
            title="Crescimento da Plataforma"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;