
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
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function CreateVideoDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [selectedStampIds, setSelectedStampIds] = useState<string[]>([]);
  const { toast } = useToast();
  const { isLoading, uploadVideo } = useVideoUpload();
  const queryClient = useQueryClient();

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
      // Se houver estampas selecionadas, criar os vínculos
      if (selectedStampIds.length > 0) {
        // Primeiro, precisamos obter o ID do vídeo recém-criado
        const { data: videos, error: queryError } = await supabase
          .from('videos')
          .select('id')
          .eq('name', name)
          .order('created_at', { ascending: false })
          .limit(1);

        if (queryError) {
          console.error("Erro ao buscar vídeo:", queryError);
          toast({
            title: "Aviso",
            description: "Vídeo criado, mas houve um erro ao vincular às estampas",
            variant: "destructive",
          });
        } else if (videos && videos.length > 0) {
          const videoId = videos[0].id;
          
          // Criar os vínculos
          const { error: linkError } = await supabase
            .from('stamp_video_links')
            .insert(
              selectedStampIds.map(stampId => ({
                stamp_id: stampId,
                video_id: videoId,
                is_active: true
              }))
            );

          if (linkError) {
            console.error("Erro ao criar vínculos:", linkError);
            toast({
              title: "Aviso",
              description: "Vídeo criado, mas houve um erro ao vincular às estampas",
              variant: "destructive",
            });
          }
        }
      }

      // Invalidar queries para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['stamp-video-links'] });

      setIsOpen(false);
      setName("");
      setDescription("");
      setVideo(null);
      setSelectedStampIds([]);
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
          selectedStampIds={selectedStampIds}
          setSelectedStampIds={setSelectedStampIds}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
