import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { Search, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateVideoDialog } from "@/components/business/CreateVideoDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { VideoCard } from "@/components/business/VideoCard";
import { VideoPreviewDialog } from "@/components/business/VideoPreviewDialog";
import { EditVideoDialog } from "@/components/business/EditVideoDialog";
import { DeleteVideoDialog } from "@/components/business/DeleteVideoDialog";
import { LinkStampsDialog } from "@/components/business/LinkStampsDialog";
import { Video as VideoType } from "@/types/video";

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<VideoType | null>(null);
  const [linkingVideo, setLinkingVideo] = useState<VideoType | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("Vídeos carregados:", data);
      return data as VideoType[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description: string }) => {
      console.log("Atualizando vídeo:", { id, name, description });
      const { data, error } = await supabase
        .from('videos')
        .update({ name, description })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: "Vídeo atualizado",
        description: "As informações do vídeo foram atualizadas com sucesso.",
      });
      setEditingVideo(null);
    },
    onError: (error) => {
      console.error("Erro ao atualizar vídeo:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o vídeo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Excluindo vídeo:", id);
      const { error } = await supabase
        .from('videos')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi excluído com sucesso.",
      });
      setDeletingVideo(null);
    },
    onError: (error) => {
      console.error("Erro ao excluir vídeo:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o vídeo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = (id: string, name: string, description: string) => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o vídeo.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({ id, name, description });
  };

  return (
    <BusinessLayout>
      <div className="flex-1 w-full">
        <div className="space-y-6 max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Seus Vídeos</h2>
              <p className="text-muted-foreground mt-1">
                Gerencie seus vídeos para conectar com estampas em AR
              </p>
            </div>
            <CreateVideoDialog />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar vídeos..."
              className="pl-10 bg-card border-muted/30 focus-visible:ring-primary/30"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin">
                <Video className="h-6 w-6 text-primary" />
              </div>
            </div>
          ) : !videos?.length ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted/50 bg-card/50 p-12 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Nenhum vídeo</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece adicionando seu primeiro vídeo para conectar com estampas em AR
              </p>
              <div className="mt-4">
                <CreateVideoDialog />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {videos.filter(v => v.status !== 'deleted').map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={setSelectedVideo}
                  onEdit={setEditingVideo}
                  onDelete={setDeletingVideo}
                  onLink={setLinkingVideo}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <VideoPreviewDialog
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <EditVideoDialog
        video={editingVideo}
        onClose={() => setEditingVideo(null)}
        onSave={handleUpdate}
        isSaving={updateMutation.isPending}
      />

      <DeleteVideoDialog
        video={deletingVideo}
        onClose={() => setDeletingVideo(null)}
        onConfirm={(id) => deleteMutation.mutate(id)}
        isDeleting={deleteMutation.isPending}
      />

      <LinkStampsDialog
        videoId={linkingVideo?.id || ""}
        isOpen={!!linkingVideo}
        onClose={() => setLinkingVideo(null)}
      />
    </BusinessLayout>
  );
}