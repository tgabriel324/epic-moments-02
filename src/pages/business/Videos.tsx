import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { Search, Video, Play, Pencil, Trash2, Loader2, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateVideoDialog } from "@/components/business/CreateVideoDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { LinkStampsDialog } from "@/components/business/LinkStampsDialog";

type Video = {
  id: string;
  name: string;
  description: string | null;
  video_url: string;
  status: 'processing' | 'ready' | 'error' | 'deleted';
};

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<Video | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [linkingVideo, setLinkingVideo] = useState<Video | null>(null);

  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("Vídeos carregados:", data);
      return data;
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

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setEditName(video.name);
    setEditDescription(video.description || "");
  };

  const handleUpdate = async () => {
    if (!editingVideo) return;
    
    if (!editName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o vídeo.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({
      id: editingVideo.id,
      name: editName,
      description: editDescription,
    });
  };

  const handleDelete = async () => {
    if (!deletingVideo) return;
    deleteMutation.mutate(deletingVideo.id);
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Vídeos
            </h1>
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
              <div
                key={video.id}
                className="group relative rounded-lg border bg-card p-4 hover:shadow-lg transition-all"
              >
                <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                  <video
                    src={video.video_url}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{video.name}</h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-muted-foreground">
                      Status: {video.status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setLinkingVideo(video)}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(video)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setDeletingVideo(video)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Preview */}
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedVideo?.name}</DialogTitle>
            </DialogHeader>
            {selectedVideo && (
              <div className="aspect-video w-full">
                <video
                  src={selectedVideo.video_url}
                  controls
                  className="w-full h-full"
                >
                  Seu navegador não suporta a reprodução de vídeos.
                </video>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
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
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Descrição (opcional)"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingVideo(null)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmação de Exclusão */}
        <Dialog open={!!deletingVideo} onOpenChange={() => setDeletingVideo(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o vídeo "{deletingVideo?.name}"? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeletingVideo(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <LinkStampsDialog
          videoId={linkingVideo?.id || ""}
          isOpen={!!linkingVideo}
          onClose={() => setLinkingVideo(null)}
        />
      </div>
    </BusinessLayout>
  );
}
