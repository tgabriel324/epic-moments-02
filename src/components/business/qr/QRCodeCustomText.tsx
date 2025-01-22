import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type QRCodeCustomTextProps = {
  customText: string | undefined;
  onCustomTextChange: (value: string) => void;
};

export function QRCodeCustomText({
  customText,
  onCustomTextChange,
}: QRCodeCustomTextProps) {
  return (
    <div>
      <Label htmlFor="custom_text">Texto Personalizado (opcional)</Label>
      <Input
        id="custom_text"
        value={customText || ""}
        onChange={(e) => onCustomTextChange(e.target.value)}
        placeholder="Escaneie para ver em AR"
      />
    </div>
  );
}