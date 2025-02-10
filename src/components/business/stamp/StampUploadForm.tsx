
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { VideoSelect } from "../video/VideoSelect";

interface StampUploadFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  selectedVideoId: string | null;
  setSelectedVideoId: (id: string | null) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function StampUploadForm({
  name,
  setName,
  description,
  setDescription,
  image,
  setImage,
  selectedVideoId,
  setSelectedVideoId,
  isLoading,
  onSubmit
}: StampUploadFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Input
            id="name"
            placeholder="Nome da estampa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Textarea
            id="description"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
              }
            }}
            required
          />
          {image && (
            <p className="text-sm text-muted-foreground">
              Arquivo selecionado: {image.name}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <VideoSelect
            selectedId={selectedVideoId}
            onSelect={setSelectedVideoId}
          />
          <p className="text-sm text-muted-foreground">
            Opcional: vincular esta estampa a um vídeo existente
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-[#00BFFF] hover:bg-[#00BFFF]/90"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar Estampa
        </Button>
      </DialogFooter>
    </form>
  );
}
