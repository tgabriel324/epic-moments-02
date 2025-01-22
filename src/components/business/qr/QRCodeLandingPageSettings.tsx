import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type QRCodeLandingPageSettingsProps = {
  title: string | undefined;
  description: string | undefined;
  primaryColor: string;
  logoUrl: string | undefined;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPrimaryColorChange: (value: string) => void;
  onLogoUrlChange: (value: string) => void;
};

export function QRCodeLandingPageSettings({
  title,
  description,
  primaryColor,
  logoUrl,
  onTitleChange,
  onDescriptionChange,
  onPrimaryColorChange,
  onLogoUrlChange,
}: QRCodeLandingPageSettingsProps) {
  return (
    <div className="border-t pt-4">
      <Label className="text-lg">Página de Destino</Label>
      <div className="space-y-4 mt-2">
        <div>
          <Label htmlFor="landing_page_title">Título</Label>
          <Input
            id="landing_page_title"
            value={title || ""}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Experiência AR"
          />
        </div>

        <div>
          <Label htmlFor="landing_page_description">Descrição</Label>
          <Input
            id="landing_page_description"
            value={description || ""}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Aponte a câmera para a estampa"
          />
        </div>

        <div>
          <Label htmlFor="landing_page_primary_color">Cor Principal</Label>
          <Input
            id="landing_page_primary_color"
            type="color"
            value={primaryColor}
            onChange={(e) => onPrimaryColorChange(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="landing_page_logo_url">Logo da Página</Label>
          <Input
            id="landing_page_logo_url"
            type="url"
            value={logoUrl || ""}
            onChange={(e) => onLogoUrlChange(e.target.value)}
            placeholder="https://exemplo.com/logo.png"
          />
        </div>
      </div>
    </div>
  );
}