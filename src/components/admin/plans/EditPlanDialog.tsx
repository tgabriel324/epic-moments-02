import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

interface EditPlanDialogProps {
  plan: {
    id: string;
    name: string;
    price: number;
    max_stamps: number;
    has_detailed_metrics: boolean;
    has_custom_branding: boolean;
    has_priority_support: boolean;
    has_advanced_reports: boolean;
  };
}

export function EditPlanDialog({ plan }: EditPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(plan.name);
  const [price, setPrice] = useState(String(plan.price));
  const [maxStamps, setMaxStamps] = useState(String(plan.max_stamps));
  const [hasDetailedMetrics, setHasDetailedMetrics] = useState(plan.has_detailed_metrics);
  const [hasCustomBranding, setHasCustomBranding] = useState(plan.has_custom_branding);
  const [hasPrioritySupport, setHasPrioritySupport] = useState(plan.has_priority_support);
  const [hasAdvancedReports, setHasAdvancedReports] = useState(plan.has_advanced_reports);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setName(plan.name);
      setPrice(String(plan.price));
      setMaxStamps(String(plan.max_stamps));
      setHasDetailedMetrics(plan.has_detailed_metrics);
      setHasCustomBranding(plan.has_custom_branding);
      setHasPrioritySupport(plan.has_priority_support);
      setHasAdvancedReports(plan.has_advanced_reports);
    }
  }, [open, plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .update({
          name,
          price: Number(price),
          max_stamps: Number(maxStamps),
          has_detailed_metrics: hasDetailedMetrics,
          has_custom_branding: hasCustomBranding,
          has_priority_support: hasPrioritySupport,
          has_advanced_reports: hasAdvancedReports,
        })
        .eq('id', plan.id);

      if (error) throw error;

      toast({
        title: "Plano atualizado com sucesso!",
        description: `As alterações no plano ${name} foram salvas.`,
      });

      setOpen(false);
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar plano",
        description: "Ocorreu um erro ao tentar atualizar o plano. Tente novamente.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Plano</DialogTitle>
          <DialogDescription>
            Atualize as informações do plano de assinatura.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pro"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99.90"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxStamps">Limite de Estampas</Label>
              <Input
                id="maxStamps"
                type="number"
                value={maxStamps}
                onChange={(e) => setMaxStamps(e.target.value)}
                placeholder="50"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="detailedMetrics">Métricas Detalhadas</Label>
              <Switch
                id="detailedMetrics"
                checked={hasDetailedMetrics}
                onCheckedChange={setHasDetailedMetrics}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="customBranding">Branding Personalizado</Label>
              <Switch
                id="customBranding"
                checked={hasCustomBranding}
                onCheckedChange={setHasCustomBranding}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="prioritySupport">Suporte Prioritário</Label>
              <Switch
                id="prioritySupport"
                checked={hasPrioritySupport}
                onCheckedChange={setHasPrioritySupport}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="advancedReports">Relatórios Avançados</Label>
              <Switch
                id="advancedReports"
                checked={hasAdvancedReports}
                onCheckedChange={setHasAdvancedReports}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}