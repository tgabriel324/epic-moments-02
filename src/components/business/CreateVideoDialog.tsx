
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Video } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { VideoUploadForm } from "./video/VideoUploadForm";
import { useVideoUpload } from "./video/useVideoUpload";

export function CreateVideoDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const { toast } = useToast();
  const { isLoading, uploadVideo } = useVideoUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!video) {
      toast({
        title: "Vídeo obrigatório",
        description: "Por favor, selecione um vídeo para upload",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o vídeo",
        variant: "destructive",
      });
      return;
    }

    // Validar tipo
    if (!video.type.startsWith('video/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo de vídeo",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (100MB)
    if (video.size > 100 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 100MB",
        variant: "destructive",
      });
      return;
    }

    const success = await uploadVideo(video, name, description);
    if (success) {
      setIsOpen(false);
      setName("");
      setDescription("");
      setVideo(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
          <Video className="mr-2 h-4 w-4" />
          Novo Vídeo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
          <DialogDescription>
            Faça upload de um vídeo para conectar com suas estampas em AR
          </DialogDescription>
        </DialogHeader>
        <VideoUploadForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          video={video}
          setVideo={setVideo}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
