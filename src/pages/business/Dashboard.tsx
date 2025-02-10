
import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { MetricsCard } from "@/components/business/metrics/MetricsCard";
import { MetricsChart } from "@/components/business/metrics/MetricsChart";
import { Eye, MousePointer, Image, Activity } from "lucide-react";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";
import { toast } from "sonner";
import { useEffect } from "react";

const BusinessDashboard = () => {
  const { data: metrics, isLoading, error } = useBusinessMetrics();

  useEffect(() => {
    if (error) {
      console.error("Erro ao carregar métricas:", error);
      toast.error("Erro ao carregar métricas do dashboard");
    }
  }, [error]);

  return (
    <BusinessLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-h2 text-primary font-semibold">
            Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Acompanhe as métricas principais do seu negócio
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total de Estampas"
            value={metrics?.stampCount || 0}
            icon={<Image className="h-3 w-3 sm:w-4 sm:h-4" />}
            description="Estampas ativas"
            className="col-span-1"
          />

          <MetricsCard
            title="Visualizações"
            value={metrics?.totalViews || 0}
            icon={<Eye className="h-3 w-3 sm:w-4 sm:h-4" />}
            description="Total de visualizações"
            className="col-span-1"
          />

          <MetricsCard
            title="Interações"
            value={metrics?.totalInteractions || 0}
            icon={<MousePointer className="h-3 w-3 sm:w-4 sm:h-4" />}
            description="Total de interações"
            className="col-span-1"
          />

          <MetricsCard
            title="Taxa de Engajamento"
            value={`${metrics?.totalViews ? 
              ((metrics.totalInteractions / metrics.totalViews) * 100).toFixed(1) : 0}%`
            }
            icon={<Activity className="h-3 w-3 sm:w-4 sm:h-4" />}
            description="Interações/Visualizações"
            className="col-span-1"
          />
        </div>

        <div className="grid gap-4 sm:gap-6">
          <MetricsChart
            data={metrics?.monthlyData || []}
            title="Visualizações vs. Interações"
          />
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessDashboard;
