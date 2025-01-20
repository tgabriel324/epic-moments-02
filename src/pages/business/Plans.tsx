import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { PricingTable } from "@/components/business/PricingTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Plans() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) {
        console.error('Error fetching plans:', error);
        toast.error('Erro ao carregar planos');
        throw error;
      }
      
      return data;
    }
  });

  if (isLoading) {
    return (
      <BusinessLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFFF]"></div>
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#000000] to-[#00BFFF] bg-clip-text text-transparent">
            Planos e Preços
          </h1>
          <p className="text-lg text-muted-foreground">
            Escolha o plano ideal para o seu negócio
          </p>
        </div>

        <PricingTable plans={plans || []} />
      </div>
    </BusinessLayout>
  );
}