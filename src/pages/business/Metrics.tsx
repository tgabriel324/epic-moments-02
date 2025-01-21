import { useState } from "react";
import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { MetricsCard } from "@/components/business/metrics/MetricsCard";
import { MetricsChart } from "@/components/business/metrics/MetricsChart";
import { QRMetricsTable } from "@/components/business/metrics/QRMetricsTable";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";
import { useMetricsExport } from "@/hooks/useMetricsExport";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Download, Eye, MousePointer, Image, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Metrics() {
  const { data: metrics, isLoading } = useBusinessMetrics();
  const { exportMetrics, isExporting } = useMetricsExport();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleExport = async () => {
    try {
      if (!date) return;
      
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      await exportMetrics(startDate, endDate);
      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast.error("Erro ao exportar relatório");
    }
  };

  if (isLoading) {
    return (
      <BusinessLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFFF]" />
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
              Métricas
            </h1>
            <p className="mt-2 text-gray-600">
              Acompanhe o desempenho das suas estampas
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy", { locale: ptBR }) : "Selecione o mês"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            <Button onClick={handleExport} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <MetricsCard
            title="Total de Estampas"
            value={metrics?.stampCount || 0}
            icon={<Image />}
          />
          <MetricsCard
            title="Visualizações"
            value={metrics?.totalViews || 0}
            icon={<Eye />}
          />
          <MetricsCard
            title="Interações"
            value={metrics?.totalInteractions || 0}
            icon={<MousePointer />}
          />
          <MetricsCard
            title="Taxa de Engajamento"
            value={`${metrics?.totalViews ? ((metrics.totalInteractions / metrics.totalViews) * 100).toFixed(1) : 0}%`}
            description="Interações / Visualizações"
          />
          <MetricsCard
            title="Tempo Médio"
            value={`${metrics?.averageInteractionTime || 0}s`}
            icon={<Clock />}
            description="Duração média das interações"
          />
        </div>

        <MetricsChart
          data={metrics?.monthlyData || []}
          title="Visualizações e Interações por Mês"
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Métricas por QR Code</h2>
          <QRMetricsTable metrics={metrics?.qrCodeMetrics || []} />
        </div>
      </div>
    </BusinessLayout>
  );
}