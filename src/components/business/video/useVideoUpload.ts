
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useVideoUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const uploadVideo = async (
    video: File,
    name: string,
    description: string
  ) => {
    console.log("Iniciando upload do vídeo");
    setIsLoading(true);

    try {
      // Obter o ID do usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Upload do vídeo para o bucket
      const fileExt = video.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
      
      console.log("Tentando fazer upload para:", filePath);

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, video);

      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        throw uploadError;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      console.log("URL pública:", publicUrl);

      // Salvar na tabela de vídeos
      const { error: insertError } = await supabase
        .from('videos')
        .insert({
          name,
          description,
          video_url: publicUrl,
          status: 'ready',
          business_id: user.id
        });

      if (insertError) {
        console.error("Erro ao inserir no banco:", insertError);
        throw insertError;
      }

      toast({
        title: "Sucesso",
        description: "Vídeo enviado com sucesso!",
      });

      return true;
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro ao enviar vídeo",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar seu vídeo. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    uploadVideo
  };
}
