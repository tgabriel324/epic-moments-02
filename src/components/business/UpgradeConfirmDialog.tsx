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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UpgradeConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: {
    id: string;
    name: string;
    price: number;
  };
}

export function UpgradeConfirmDialog({
  isOpen,
  onOpenChange,
  plan,
}: UpgradeConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Você precisa estar logado para fazer upgrade");
        return;
      }

      console.log('Iniciando processo de upgrade para o plano:', plan.id);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId: plan.id }
      });

      if (error) {
        console.error('Erro ao criar sessão de checkout:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecionando para URL de checkout:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (error) {
      console.error("Erro ao processar upgrade:", error);
      toast.error("Erro ao processar upgrade. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Upgrade</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a fazer upgrade para o plano {plan.name} por{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(plan.price)}{" "}
            por mês. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-[#000000] to-[#00BFFF]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Continuar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}