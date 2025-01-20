import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Video } from "@/types/video";

type DeleteVideoDialogProps = {
  video: Video | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isDeleting: boolean;
};

export function DeleteVideoDialog({ video, onClose, onConfirm, isDeleting }: DeleteVideoDialogProps) {
  const handleDelete = () => {
    if (!video) return;
    onConfirm(video.id);
  };

  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o vídeo "{video?.name}"? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}