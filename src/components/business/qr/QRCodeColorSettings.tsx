import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type QRCodeColorSettingsProps = {
  foregroundColor: string;
  backgroundColor: string;
  onForegroundColorChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
};

export function QRCodeColorSettings({
  foregroundColor,
  backgroundColor,
  onForegroundColorChange,
  onBackgroundColorChange,
}: QRCodeColorSettingsProps) {
  return (
    <div>
      <Label>Cores do QR Code</Label>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <Label htmlFor="foreground_color" className="text-sm">
            Cor Principal
          </Label>
          <Input
            id="foreground_color"
            type="color"
            value={foregroundColor}
            onChange={(e) => onForegroundColorChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="background_color" className="text-sm">
            Cor de Fundo
          </Label>
          <Input
            id="background_color"
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}