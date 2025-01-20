import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

type Stamp = {
  id: string;
  name: string;
  image_url: string;
};

type LinkStampsDialogProps = {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
};

export function LinkStampsDialog({ videoId, isOpen, onClose }: LinkStampsDialogProps) {
  const [selectedStamps, setSelectedStamps] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar todas as estampas do usuário
  const { data: stamps, isLoading: loadingStamps } = useQuery({
    queryKey: ['stamps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stamps')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Stamp[];
    },
  });

  // Buscar vinculações existentes
  const { data: existingLinks, isLoading: loadingLinks } = useQuery({
    queryKey: ['stamp-video-links', videoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stamp_video_links')
        .select('stamp_id')
        .eq('video_id', videoId)
        .eq('is_active', true);

      if (error) throw error;
      return data.map(link => link.stamp_id);
    },
    enabled: !!videoId,
  });

  // Atualizar seleção inicial com vinculações existentes
  useEffect(() => {
    if (existingLinks) {
      setSelectedStamps(existingLinks);
    }
  }, [existingLinks]);

  // Mutation para salvar vinculações
  const linkMutation = useMutation({
    mutationFn: async (stampIds: string[]) => {
      console.log("Atualizando vinculações:", { videoId, stampIds });

      // Primeiro, desativa todas as vinculações existentes
      const { error: deactivateError } = await supabase
        .from('stamp_video_links')
        .update({ is_active: false })
        .eq('video_id', videoId);

      if (deactivateError) throw deactivateError;

      // Depois, cria novas vinculações para as estampas selecionadas
      if (stampIds.length > 0) {
        const { error: insertError } = await supabase
          .from('stamp_video_links')
          .insert(
            stampIds.map(stampId => ({
              video_id: videoId,
              stamp_id: stampId,
              is_active: true
            }))
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stamp-video-links'] });
      toast({
        title: "Vinculações atualizadas",
        description: "As estampas foram vinculadas com sucesso ao vídeo.",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Erro ao vincular estampas:", error);
      toast({
        title: "Erro ao vincular estampas",
        description: "Não foi possível atualizar as vinculações. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    linkMutation.mutate(selectedStamps);
  };

  const toggleStamp = (stampId: string) => {
    setSelectedStamps(current =>
      current.includes(stampId)
        ? current.filter(id => id !== stampId)
        : [...current, stampId]
    );
  };

  const isLoading = loadingStamps || loadingLinks || linkMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular Estampas</DialogTitle>
          <DialogDescription>
            Selecione as estampas que deseja vincular a este vídeo
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !stamps?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma estampa encontrada
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {stamps.map((stamp) => (
                <div
                  key={stamp.id}
                  className="flex items-center space-x-4 rounded-lg border p-4"
                >
                  <Checkbox
                    id={stamp.id}
                    checked={selectedStamps.includes(stamp.id)}
                    onCheckedChange={() => toggleStamp(stamp.id)}
                  />
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor={stamp.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {stamp.name}
                    </label>
                  </div>
                  <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img
                      src={stamp.image_url}
                      alt={stamp.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}