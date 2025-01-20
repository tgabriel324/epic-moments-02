import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  max_stamps: number;
  has_detailed_metrics: boolean;
  has_custom_branding: boolean;
  has_priority_support: boolean;
  has_advanced_reports: boolean;
}

interface PricingTableProps {
  plans: Plan[];
}

export function PricingTable({ plans }: PricingTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
            
            <Button className="w-full" variant={plan.name === 'Pro' ? 'default' : 'outline'}>
              Fazer Upgrade
            </Button>
          </div>
          
          <div className="p-6 border-t space-y-4">
            <h4 className="text-sm font-medium">O que está incluído:</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#00BFFF]" />
                <span>Até {plan.max_stamps} estampas</span>
              </li>
              
              {plan.has_detailed_metrics && (
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#00BFFF]" />
                  <span>Métricas detalhadas</span>
                </li>
              )}
              
              {plan.has_custom_branding && (
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#00BFFF]" />
                  <span>Personalização de marca</span>
                </li>
              )}
              
              {plan.has_priority_support && (
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#00BFFF]" />
                  <span>Suporte prioritário</span>
                </li>
              )}
              
              {plan.has_advanced_reports && (
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#00BFFF]" />
                  <span>Relatórios avançados</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}