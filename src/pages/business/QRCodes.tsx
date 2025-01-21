import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { QRPreviewDialog } from "@/components/business/QRPreviewDialog";
import { QRCodeList } from "@/components/business/qr/QRCodeList";
import { QRCodeHeader } from "@/components/business/qr/QRCodeHeader";

export default function QRCodes() {
  const [selectedStamps, setSelectedStamps] = useState<string[]>([]);
  const [previewStamp, setPreviewStamp] = useState<string | null>(null);

  const { data: stamps, isLoading } = useQuery({
    queryKey: ["stamps-for-qr"],
    queryFn: async () => {
      console.log("Buscando estampas para QR codes...");
      const { data, error } = await supabase
        .from("stamps")
        .select("*")
        .eq("status", "active");

      if (error) {
        console.error("Erro ao buscar estampas:", error);
        toast.error("Erro ao carregar estampas");
        throw error;
      }

      console.log("Estampas carregadas:", data);
      return data;
    },
  });

  const handleStampSelect = (stampId: string) => {
    if (stampId === "all" && stamps) {
      setSelectedStamps(stamps.map((s) => s.id));
    } else if (stampId === "none") {
      setSelectedStamps([]);
    } else {
      setSelectedStamps((current) =>
        current.includes(stampId)
          ? current.filter((id) => id !== stampId)
          : [...current, stampId]
      );
    }
  };

  const handleDownloadQR = async (stampId: string) => {
    try {
      const stamp = stamps?.find((s) => s.id === stampId);
      if (!stamp) {
        toast.error("Estampa não encontrada");
        return;
      }

      const { data, error } = await supabase.functions.invoke("generate-qr", {
        body: { stampId },
      });

      if (error) throw error;

      const link = document.createElement("a");
      link.href = data.qrCode;
      link.download = `qrcode-${stamp.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR code baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar QR code:", error);
      toast.error("Erro ao baixar QR code");
    }
  };

  const handleBatchDownload = async () => {
    try {
      const selectedStampsData = stamps?.filter((s) =>
        selectedStamps.includes(s.id)
      );
      if (!selectedStampsData?.length) {
        toast.error("Nenhuma estampa selecionada");
        return;
      }

      for (const stamp of selectedStampsData) {
        await handleDownloadQR(stamp.id);
      }

      toast.success("QR codes baixados com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar QR codes:", error);
      toast.error("Erro ao baixar QR codes");
    }
  };

  return (
    <BusinessLayout>
      <div className="flex-1 h-full">
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
          <QRCodeHeader
            selectedCount={selectedStamps.length}
            onBatchDownload={handleBatchDownload}
          />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar estampas..."
              className="pl-10 bg-card border-muted/30 focus-visible:ring-primary/30"
            />
          </div>

          <QRCodeList
            stamps={stamps}
            isLoading={isLoading}
            selectedStamps={selectedStamps}
            onStampSelect={handleStampSelect}
            onPreview={setPreviewStamp}
            onDownload={handleDownloadQR}
          />
        </div>
      </div>
      
      <QRPreviewDialog
        stampId={previewStamp}
        onClose={() => setPreviewStamp(null)}
      />
    </BusinessLayout>
  );
}