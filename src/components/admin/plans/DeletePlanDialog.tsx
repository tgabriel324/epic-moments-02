import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash } from "lucide-react";

interface DeletePlanDialogProps {
  planId: string;
  planName: string;
}

export function DeletePlanDialog({ planId, planName }: DeletePlanDialogProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Plano excluído com sucesso!",
        description: `O plano ${planName} foi removido do sistema.`,
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir plano",
        description: "Não foi possível excluir o plano. Ele pode estar em uso por algum usuário.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Plano</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o plano {planName}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}