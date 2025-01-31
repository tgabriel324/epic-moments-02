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
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9 hover:bg-gray-100"
        >
          <Trash className="h-5 w-5 text-gray-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">Excluir Plano</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500">
            Tem certeza que deseja excluir o plano {planName}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11">Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white h-11"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}