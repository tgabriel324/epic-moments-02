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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Planos e Preços</h1>
          <p className="text-gray-500 mt-2">
            Escolha o plano ideal para o seu negócio
          </p>
        </div>

        <PricingTable plans={plans || []} />
      </div>
    </BusinessLayout>
  );
}