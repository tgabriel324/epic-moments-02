import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Video } from "@/types/video";
import { useState } from "react";

type EditVideoDialogProps = {
  video: Video | null;
  onClose: () => void;
  onSave: (id: string, name: string, description: string) => void;
  isSaving: boolean;
};

export function EditVideoDialog({ video, onClose, onSave, isSaving }: EditVideoDialogProps) {
  const [name, setName] = useState(video?.name || "");
  const [description, setDescription] = useState(video?.description || "");

  const handleSave = () => {
    if (!video) return;
    onSave(video.id, name, description);
  };

  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Vídeo</DialogTitle>
          <DialogDescription>
            Atualize as informações do vídeo
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Nome do vídeo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}