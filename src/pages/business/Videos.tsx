import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { Search, Video, Play, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateVideoDialog } from "@/components/business/CreateVideoDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    name: string;
    video_url: string;
  } | null>(null);

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
            {videos.map((video) => (
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
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
      </div>
    </BusinessLayout>
  );
}