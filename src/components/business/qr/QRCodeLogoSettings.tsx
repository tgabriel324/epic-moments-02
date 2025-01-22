import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type QRCodeLogoSettingsProps = {
  logoUrl: string | undefined;
  onLogoUrlChange: (value: string) => void;
};

export function QRCodeLogoSettings({
  logoUrl,
  onLogoUrlChange,
}: QRCodeLogoSettingsProps) {
  return (
    <div>
      <Label htmlFor="logo_url">URL do Logo (opcional)</Label>
      <Input
        id="logo_url"
        type="url"
        value={logoUrl || ""}
        onChange={(e) => onLogoUrlChange(e.target.value)}
        placeholder="https://exemplo.com/logo.png"
      />
    </div>
  );
}