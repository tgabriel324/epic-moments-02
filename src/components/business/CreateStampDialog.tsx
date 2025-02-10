
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StampUploadForm } from "./stamp/StampUploadForm";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function CreateStampDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!image) {
      toast({
        title: "Imagem obrigatória",
        description: "Por favor, selecione uma imagem para upload",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a estampa",
        variant: "destructive",
      });
      return;
    }

    // Validar tipo
    if (!image.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo de imagem",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (5MB)
    if (image.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB",
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

      // Upload da imagem para o bucket
      const fileExt = image.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
      
      console.log("Tentando fazer upload para:", filePath);

      const { error: uploadError } = await supabase.storage
        .from('stamps')
        .upload(filePath, image);

      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        throw uploadError;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('stamps')
        .getPublicUrl(filePath);

      console.log("URL pública:", publicUrl);

      // Salvar na tabela de estampas
      const { data: stamp, error: insertError } = await supabase
        .from('stamps')
        .insert({
          name,
          description,
          image_url: publicUrl,
          status: 'active',
          business_id: user.id
        })
        .select()
        .single();

      if (insertError) {
        console.error("Erro ao inserir no banco:", insertError);
        throw insertError;
      }

      // Se um vídeo foi selecionado, criar o vínculo
      if (selectedVideoId && stamp) {
        const { error: linkError } = await supabase
          .from('stamp_video_links')
          .insert({
            stamp_id: stamp.id,
            video_id: selectedVideoId,
            is_active: true
          });

        if (linkError) {
          console.error("Erro ao criar vínculo:", linkError);
          toast({
            title: "Aviso",
            description: "Estampa criada, mas houve um erro ao vincular ao vídeo",
            variant: "destructive",
          });
        }
      }

      // Invalidar queries para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ['stamps'] });

      toast({
        title: "Sucesso",
        description: "Estampa criada com sucesso!",
      });

      setIsOpen(false);
      setName("");
      setDescription("");
      setImage(null);
      setSelectedVideoId(null);
    } catch (error) {
      console.error("Erro ao criar estampa:", error);
      toast({
        title: "Erro ao criar estampa",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar sua estampa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white shadow-lg shadow-[#00BFFF]/20 transition-all hover:shadow-[#00BFFF]/40">
          <ImagePlus className="mr-2 h-4 w-4" />
          Nova Estampa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Estampa</DialogTitle>
          <DialogDescription>
            Faça upload de uma estampa para conectar com vídeos em AR
          </DialogDescription>
        </DialogHeader>
        <StampUploadForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          image={image}
          setImage={setImage}
          selectedVideoId={selectedVideoId}
          setSelectedVideoId={setSelectedVideoId}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
