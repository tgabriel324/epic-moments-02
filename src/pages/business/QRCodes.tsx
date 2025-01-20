import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Loader2, QrCode } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QRCodeSettingsDialog } from "@/components/business/QRCodeSettingsDialog";

export default function QRCodes() {
  const [selectedStamps, setSelectedStamps] = useState<string[]>([]);
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);

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

  const handleDownloadQR = async (id: string) => {
    try {
      setGeneratingQR(id);
      const stamp = stamps?.find(s => s.id === id);
      if (!stamp) {
        toast.error("Estampa não encontrada");
        return;
      }

      // Gerar QR code usando a Edge Function
      const { data, error } = await supabase.functions.invoke('generate-qr', {
        body: { stampId: id }
      });

      if (error) {
        throw error;
      }

      // Criar link de download
      const link = document.createElement('a');
      link.href = data.qrCode;
      link.download = `qrcode-${stamp.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR code baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar QR code:", error);
      toast.error("Erro ao baixar QR code");
    } finally {
      setGeneratingQR(null);
    }
  };

  const handleBatchDownload = async () => {
    try {
      const selectedStampsData = stamps?.filter(s => selectedStamps.includes(s.id));
      if (!selectedStampsData?.length) {
        toast.error("Nenhuma estampa selecionada");
        return;
      }

      // Gerar todos os QR codes selecionados
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
      <div className="space-y-6">
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
            {selectedStamps.length > 0 && (
              <Button onClick={handleBatchDownload} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Baixar Selecionados
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked && stamps) {
                          setSelectedStamps(stamps.map((s) => s.id));
                        } else {
                          setSelectedStamps([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Estampa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stamps?.map((stamp) => (
                  <TableRow key={stamp.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedStamps.includes(stamp.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStamps([...selectedStamps, stamp.id]);
                          } else {
                            setSelectedStamps(
                              selectedStamps.filter((id) => id !== stamp.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{stamp.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {stamp.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{stamp.status}</TableCell>
                    <TableCell>
                      {new Date(stamp.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadQR(stamp.id)}
                        disabled={generatingQR === stamp.id}
                      >
                        {generatingQR === stamp.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}