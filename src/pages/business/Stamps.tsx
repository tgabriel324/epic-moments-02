import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { ImagePlus, Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { CreateStampDialog } from "@/components/business/CreateStampDialog";
import { useState } from "react";
import { EditStampDialog } from "@/components/business/EditStampDialog";
import { DeleteStampDialog } from "@/components/business/DeleteStampDialog";
import { PreviewStampDialog } from "@/components/business/PreviewStampDialog";
import { useToast } from "@/hooks/use-toast";

type Stamp = Tables<"stamps">;

export default function Stamps() {
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
  const [editingStamp, setEditingStamp] = useState<Stamp | null>(null);
  const [deletingStamp, setDeletingStamp] = useState<Stamp | null>(null);
  const [previewStamp, setPreviewStamp] = useState<Stamp | null>(null);
  const { toast } = useToast();

  const { data: stamps, isLoading } = useQuery({
    queryKey: ["stamps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stamps")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Estampas carregadas:", data);
      return data as Stamp[];
    },
  });

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Estampas
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas estampas e conecte-as com vídeos em AR
            </p>
          </div>
          <CreateStampDialog />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar estampas..."
            className="pl-10 bg-card border-muted/30 focus-visible:ring-primary/30"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-lg bg-card border border-muted/20 animate-pulse"
              />
            ))}
          </div>
        ) : !stamps?.length ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted/50 bg-card/50 p-12 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <ImagePlus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Nenhuma estampa</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece adicionando sua primeira estampa para conectar com vídeos em AR
            </p>
            <CreateStampDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stamps.map((stamp) => (
              <div
                key={stamp.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-muted/20 bg-card shadow-sm transition-all hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20"
              >
                <img
                  src={stamp.image_url}
                  alt={stamp.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 p-4 w-full">
                    <h3 className="text-lg font-semibold text-white">
                      {stamp.name}
                    </h3>
                    {stamp.description && (
                      <p className="mt-1 text-sm text-gray-200 line-clamp-2">
                        {stamp.description}
                      </p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setPreviewStamp(stamp)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => setEditingStamp(stamp)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Edit className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => setDeletingStamp(stamp)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <EditStampDialog
          stamp={editingStamp}
          onClose={() => setEditingStamp(null)}
        />

        <DeleteStampDialog
          stamp={deletingStamp}
          onClose={() => setDeletingStamp(null)}
        />

        <PreviewStampDialog
          stamp={previewStamp}
          onClose={() => setPreviewStamp(null)}
        />
      </div>
    </BusinessLayout>
  );
}