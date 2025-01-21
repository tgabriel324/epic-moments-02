import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface QRCodeBatchActionsProps {
  selectedCount: number;
  onBatchDownload: () => void;
}

export function QRCodeBatchActions({
  selectedCount,
  onBatchDownload,
}: QRCodeBatchActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <Button onClick={onBatchDownload} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      Baixar {selectedCount} Selecionados
    </Button>
  );
}