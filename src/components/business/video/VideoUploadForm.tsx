
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface VideoUploadFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  video: File | null;
  setVideo: (video: File | null) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function VideoUploadForm({
  name,
  setName,
  description,
  setDescription,
  video,
  setVideo,
  isLoading,
  onSubmit
}: VideoUploadFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Input
            id="name"
            placeholder="Nome do vídeo"
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
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setVideo(file);
              }
            }}
            required
          />
          {video && (
            <p className="text-sm text-muted-foreground">
              Arquivo selecionado: {video.name}
            </p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Vídeo
        </Button>
      </DialogFooter>
    </form>
  );
}
