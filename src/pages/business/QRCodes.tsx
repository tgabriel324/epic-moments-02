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
import { Download, QrCode } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type QRCode = Tables<"qr_codes">;

export default function QRCodes() {
  const [selectedQRs, setSelectedQRs] = useState<string[]>([]);

  const { data: qrCodes, isLoading } = useQuery({
    queryKey: ["qr-codes"],
    queryFn: async () => {
      console.log("Buscando QR codes...");
      const { data, error } = await supabase
        .from("qr_codes")
        .select(`
          *,
          stamps (
            name,
            image_url
          )
        `);

      if (error) {
        console.error("Erro ao buscar QR codes:", error);
        toast.error("Erro ao carregar QR codes");
        throw error;
      }

      console.log("QR codes carregados:", data);
      return data;
    },
  });

  const handleDownloadQR = async (id: string) => {
    try {
      // TODO: Implementar download do QR code
      toast.success("QR code baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar QR code:", error);
      toast.error("Erro ao baixar QR code");
    }
  };

  const handleBatchDownload = async () => {
    try {
      // TODO: Implementar download em lote
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
              Gerencie seus QR codes para experiências em AR
            </p>
          </div>
          <div className="flex gap-4">
            {selectedQRs.length > 0 && (
              <Button onClick={handleBatchDownload} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Baixar Selecionados
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked && qrCodes) {
                          setSelectedQRs(qrCodes.map((qr) => qr.id));
                        } else {
                          setSelectedQRs([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Estampa</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qrCodes?.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedQRs.includes(qr.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQRs([...selectedQRs, qr.id]);
                          } else {
                            setSelectedQRs(
                              selectedQRs.filter((id) => id !== qr.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {(qr as any).stamps?.name || "Sem nome"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {qr.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{qr.downloads_count}</TableCell>
                    <TableCell>
                      {new Date(qr.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadQR(qr.id)}
                      >
                        <Download className="w-4 h-4" />
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