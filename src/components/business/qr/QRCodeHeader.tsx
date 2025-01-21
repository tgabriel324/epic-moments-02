import { QRCodeSettingsDialog } from "@/components/business/QRCodeSettingsDialog";
import { QRCodeBatchActions } from "./QRCodeBatchActions";

interface QRCodeHeaderProps {
  selectedCount: number;
  onBatchDownload: () => void;
}

export function QRCodeHeader({ selectedCount, onBatchDownload }: QRCodeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          QR Codes
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie QR codes para suas estampas em AR
        </p>
      </div>
      <div className="flex gap-4">
        <QRCodeSettingsDialog />
        <QRCodeBatchActions
          selectedCount={selectedCount}
          onBatchDownload={onBatchDownload}
        />
      </div>
    </div>
  );
}