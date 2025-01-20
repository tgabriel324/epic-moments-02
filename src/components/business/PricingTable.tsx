import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
            plan.name === 'pro' ? 'border-[#00BFFF] shadow-lg scale-105' : ''
          }`}
        >
          {plan.name === 'pro' && (
            <div className="absolute top-0 right-0 bg-[#00BFFF] text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
              Popular
            </div>
          )}
          
          <div className="p-6 space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold capitalize">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-[#000000] to-[#00BFFF] hover:opacity-90 transition-opacity" 
              variant={plan.name === 'pro' ? 'default' : 'outline'}
            >
              Fazer Upgrade
            </Button>
          </div>
          
          <div className="p-6 border-t space-y-4 bg-gray-50">
            <h4 className="text-sm font-medium text-muted-foreground">O que está incluído:</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#00BFFF]" />
                <span>Até {plan.max_stamps.toLocaleString()} estampas</span>
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
        </Card>
      ))}
    </div>
  );
}