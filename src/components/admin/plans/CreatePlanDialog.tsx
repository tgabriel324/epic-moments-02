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
  const [name, setName] = useState<"free" | "pro" | "enterprise">("free");
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
        .insert({
          name,
          price: Number(price),
          max_stamps: Number(maxStamps),
          has_detailed_metrics: hasDetailedMetrics,
          has_custom_branding: hasCustomBranding,
          has_priority_support: hasPrioritySupport,
          has_advanced_reports: hasAdvancedReports,
        });

      if (error) throw error;

      toast({
        title: "Plano criado com sucesso!",
        description: `O plano ${name} foi adicionado ao sistema.`,
      });

      setOpen(false);
      // Reset form
      setName("free");
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
        <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white font-medium h-11">
          <Package className="w-5 h-5 mr-2" />
          Novo Plano
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Criar Novo Plano</DialogTitle>
          <DialogDescription className="text-gray-500">
            Defina os detalhes do novo plano de assinatura.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome do Plano</Label>
              <select
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value as "free" | "pro" | "enterprise")}
                className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
                required
              >
                <option value="free">Grátis</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-sm font-medium">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99.90"
                className="h-11"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxStamps" className="text-sm font-medium">Limite de Estampas</Label>
              <Input
                id="maxStamps"
                type="number"
                value={maxStamps}
                onChange={(e) => setMaxStamps(e.target.value)}
                placeholder="50"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="detailedMetrics" className="text-sm font-medium">Métricas Detalhadas</Label>
                <Switch
                  id="detailedMetrics"
                  checked={hasDetailedMetrics}
                  onCheckedChange={setHasDetailedMetrics}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="customBranding" className="text-sm font-medium">Branding Personalizado</Label>
                <Switch
                  id="customBranding"
                  checked={hasCustomBranding}
                  onCheckedChange={setHasCustomBranding}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="prioritySupport" className="text-sm font-medium">Suporte Prioritário</Label>
                <Switch
                  id="prioritySupport"
                  checked={hasPrioritySupport}
                  onCheckedChange={setHasPrioritySupport}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="advancedReports" className="text-sm font-medium">Relatórios Avançados</Label>
                <Switch
                  id="advancedReports"
                  checked={hasAdvancedReports}
                  onCheckedChange={setHasAdvancedReports}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white font-medium h-11">
              Criar Plano
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}