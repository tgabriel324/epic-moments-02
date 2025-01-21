import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
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
import { useState } from "react";
import { toast } from "sonner";

export function SubscriptionManager() {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return null;

      const { data } = await supabase
        .from('business_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            price,
            max_stamps
          )
        `)
        .eq('business_id', session.user.id)
        .eq('is_active', true)
        .single();

      return data;
    }
  });

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Você precisa estar logado");
        return;
      }

      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const { error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      toast.success("Assinatura cancelada com sucesso");
      setCancelDialogOpen(false);
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      toast.error("Erro ao cancelar assinatura");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Você não possui uma assinatura ativa
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            Plano {subscription.subscription_plans.name}
          </h3>
          <p className="text-muted-foreground">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(subscription.subscription_plans.price)}{" "}
            por mês
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Limite de estampas:{" "}
            {subscription.subscription_plans.max_stamps.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Próxima cobrança:{" "}
            {new Date(subscription.start_date).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={() => setCancelDialogOpen(true)}
          className="w-full"
        >
          Cancelar Assinatura
        </Button>
      </Card>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Assinatura</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar sua assinatura? Você perderá acesso
              aos recursos premium ao final do período atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-destructive text-destructive-foreground"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                "Confirmar Cancelamento"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}