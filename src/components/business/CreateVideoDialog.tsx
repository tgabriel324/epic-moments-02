import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Video, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function CreateVideoDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const { toast } = useToast();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo de vídeo",
          variant: "destructive",
        });
        return;
      }
      // Validar tamanho (100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 100MB",
          variant: "destructive",
        });
        return;
      }
      setVideo(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) {
      toast({
        title: "Vídeo obrigatório",
        description: "Por favor, selecione um vídeo para upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Obter o ID do usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      console.log("Iniciando upload do vídeo:", { name, description, videoName: video.name, userId: user.id });
      
      // Preparar FormData para envio
      const formData = new FormData();
      formData.append('file', video);

      // Enviar para o endpoint de otimização
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/optimize-video`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao otimizar vídeo');
      }

      const { publicUrl } = await response.json();

      console.log("Vídeo otimizado e enviado:", publicUrl);

      // Inserir registro na tabela de vídeos
      const { data: videoData, error: insertError } = await supabase
        .from('videos')
        .insert({
          name,
          description,
          video_url: publicUrl,
          status: 'processing',
          business_id: user.id
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Erro ao salvar vídeo: ${insertError.message}`);
      }

      console.log("Vídeo salvo com sucesso:", videoData);

      toast({
        title: "Sucesso",
        description: "Vídeo enviado com sucesso!",
      });
      
      setIsOpen(false);
      setName("");
      setDescription("");
      setVideo(null);
    } catch (error) {
      console.error("Erro ao fazer upload do vídeo:", error);
      toast({
        title: "Erro ao enviar vídeo",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar seu vídeo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
            <DialogDescription>
              Faça upload de um vídeo para conectar com suas estampas em AR
            </DialogDescription>
          </DialogHeader>
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
                onChange={handleVideoChange}
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
      </DialogContent>
    </Dialog>
  );
}