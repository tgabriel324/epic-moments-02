import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";

type Stamp = Tables<"stamps">;

type DeleteStampDialogProps = {
  stamp: Stamp | null;
  onClose: () => void;
};

export function DeleteStampDialog({ stamp, onClose }: DeleteStampDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!stamp) return;

      console.log("Excluindo estampa:", stamp.id);

      const { error } = await supabase
        .from("stamps")
        .update({ status: "deleted" })
        .eq("id", stamp.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stamps"] });
      toast({
        title: "Estampa excluída",
        description: "A estampa foi excluída com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Erro ao excluir estampa:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a estampa. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return (
    <AlertDialog open={!!stamp} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir estampa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta estampa? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}