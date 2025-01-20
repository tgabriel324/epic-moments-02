import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";

type Stamp = Tables<"stamps">;

type PreviewStampDialogProps = {
  stamp: Stamp | null;
  onClose: () => void;
};

export function PreviewStampDialog({ stamp, onClose }: PreviewStampDialogProps) {
  return (
    <Dialog open={!!stamp} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{stamp?.name}</DialogTitle>
          {stamp?.description && (
            <DialogDescription>{stamp.description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-4">
          {stamp?.image_url && (
            <img
              src={stamp.image_url}
              alt={stamp.name}
              className="w-full rounded-lg object-cover"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}