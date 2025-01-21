import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface QRPreviewDialogProps {
  stampId: string | null;
  onClose: () => void;
}

export function QRPreviewDialog({ stampId, onClose }: QRPreviewDialogProps) {
  const { data: qrCode, isLoading } = useQuery({
    queryKey: ["qr-preview", stampId],
    queryFn: async () => {
      if (!stampId) return null;
      
      console.log("Gerando preview do QR code para estampa:", stampId);
      const { data, error } = await supabase.functions.invoke('generate-qr', {
        body: { stampId, preview: true }
      });

      if (error) throw error;
      return data.qrCode;
    },
    enabled: !!stampId
  });

  return (
    <Dialog open={!!stampId} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Preview do QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-6">
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          ) : qrCode ? (
            <img
              src={qrCode}
              alt="QR Code Preview"
              className="max-w-full h-auto rounded-lg border"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}