import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QrCode, Eye, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useState } from "react";

type Stamp = Tables<"stamps">;

interface QRCodeListProps {
  stamps: Stamp[] | undefined;
  isLoading: boolean;
  selectedStamps: string[];
  onStampSelect: (stampId: string) => void;
  onPreview: (stampId: string) => void;
  onDownload: (stampId: string) => void;
}

export function QRCodeList({
  stamps,
  isLoading,
  selectedStamps,
  onStampSelect,
  onPreview,
  onDownload,
}: QRCodeListProps) {
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);

  const handleDownload = async (stampId: string) => {
    setGeneratingQR(stampId);
    try {
      await onDownload(stampId);
    } finally {
      setGeneratingQR(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked && stamps) {
                    onStampSelect("all");
                  } else {
                    onStampSelect("none");
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
                  onChange={(e) => onStampSelect(stamp.id)}
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
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview(stamp.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(stamp.id)}
                    disabled={generatingQR === stamp.id}
                  >
                    {generatingQR === stamp.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}