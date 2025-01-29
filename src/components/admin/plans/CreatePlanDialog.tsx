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
import { Package } from "lucide-react";
import { useState } from "react";

export function CreatePlanDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [maxStamps, setMaxStamps] = useState("");
  const [hasDetailedMetrics, setHasDetailedMetrics] = useState(false);
  const [hasCustomBranding, setHasCustomBranding] = useState(false);
  const [hasPrioritySupport, setHasPrioritySupport] = useState(false);
  const [hasAdvancedReports, setHasAdvancedReports] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .insert([
          {
            name,
            price: Number(price),
            max_stamps: Number(maxStamps),
            has_detailed_metrics: hasDetailedMetrics,
            has_custom_branding: hasCustomBranding,
            has_priority_support: hasPrioritySupport,
            has_advanced_reports: hasAdvancedReports,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Plano criado com sucesso!",
        description: `O plano ${name} foi adicionado ao sistema.`,
      });

      setOpen(false);
      // Reset form
      setName("");
      setPrice("");
      setMaxStamps("");
      setHasDetailedMetrics(false);
      setHasCustomBranding(false);
      setHasPrioritySupport(false);
      setHasAdvancedReports(false);
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar plano",
        description: "Ocorreu um erro ao tentar criar o plano. Tente novamente.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90">
          <Package className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Plano</DialogTitle>
          <DialogDescription>
            Defina os detalhes do novo plano de assinatura.
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
            <Button type="submit">Criar Plano</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}