import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Eye, MousePointer } from "lucide-react";

interface QRMetricsTableProps {
  metrics: {
    stampId: string;
    stampName: string;
    views: number;
    interactions: number;
    averageTime: number;
  }[];
}

export function QRMetricsTable({ metrics }: QRMetricsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estampa</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visualizações
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                Interações
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tempo Médio
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.stampId}>
              <TableCell className="font-medium">{metric.stampName}</TableCell>
              <TableCell>{metric.views}</TableCell>
              <TableCell>{metric.interactions}</TableCell>
              <TableCell>{metric.averageTime}s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}