import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { VideoPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { CreateVideoDialog } from "@/components/business/CreateVideoDialog";

export default function Videos() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Tables<"videos">[];
    },
  });

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-card border border-muted/20 animate-pulse"
              />
            ))}
          </div>
        ) : videos?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted/50 bg-card/50 p-12 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <VideoPlus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Nenhum vídeo</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece adicionando seu primeiro vídeo para conectar com estampas em AR
            </p>
            <CreateVideoDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos?.map((video) => (
              <div
                key={video.id}
                className="group relative aspect-video overflow-hidden rounded-lg border border-muted/20 bg-card shadow-sm transition-all hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20"
              >
                <video
                  src={video.video_url}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {video.name}
                    </h3>
                    {video.description && (
                      <p className="mt-1 text-sm text-gray-200 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}