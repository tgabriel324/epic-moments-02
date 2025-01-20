import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";

type Stamp = Tables<"stamps">;

type EditStampDialogProps = {
  stamp: Stamp | null;
  onClose: () => void;
};

export function EditStampDialog({ stamp, onClose }: EditStampDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (stamp) {
      setName(stamp.name);
      setDescription(stamp.description || "");
    }
  }, [stamp]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!stamp) return;

      console.log("Atualizando estampa:", { id: stamp.id, name, description });

      const { error } = await supabase
        .from("stamps")
        .update({ name, description })
        .eq("id", stamp.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stamps"] });
      toast({
        title: "Estampa atualizada",
        description: "As informações da estampa foram atualizadas com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Erro ao atualizar estampa:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a estampa. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a estampa.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate();
  };

  return (
    <Dialog open={!!stamp} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Estampa</DialogTitle>
            <DialogDescription>
              Atualize as informações da estampa
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="name"
                placeholder="Nome da estampa"
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
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-[#00BFFF] hover:bg-[#00BFFF]/90"
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}