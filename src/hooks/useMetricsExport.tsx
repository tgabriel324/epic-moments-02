import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useMetricsExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportMetrics = async (startDate: Date, endDate: Date) => {
    try {
      setIsExporting(true);
      console.log('Exportando métricas...', { startDate, endDate });

      const { data: metricsData, error } = await supabase
        .from('usage_metrics')
        .select(`
          month_year,
          stamp_count,
          total_views,
          total_interactions
        `)
        .gte('month_year', startDate.toISOString())
        .lte('month_year', endDate.toISOString())
        .order('month_year', { ascending: true });

      if (error) throw error;

      // Formatar dados para CSV
      const csvContent = [
        ['Período', 'Total de Estampas', 'Visualizações', 'Interações'],
        ...metricsData.map(row => [
          new Date(row.month_year).toLocaleDateString('pt-BR'),
          row.stamp_count,
          row.total_views,
          row.total_interactions
        ])
      ]
        .map(row => row.join(','))
        .join('\n');

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `metricas_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error('Erro ao exportar métricas:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportMetrics, isExporting };
}