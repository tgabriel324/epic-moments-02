import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type QRCodeSettings = {
  id?: string;
  business_id: string;
  foreground_color: string;
  background_color: string;
  logo_url?: string;
  border_style?: string;
  border_size?: number;
  custom_text?: string;
  landing_page_title?: string;
  landing_page_description?: string;
  landing_page_primary_color: string;
  landing_page_logo_url?: string;
};

export function QRCodeSettingsDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<QRCodeSettings>({
    business_id: "",
    foreground_color: "#000000",
    background_color: "#FFFFFF",
    landing_page_primary_color: "#00BFFF",
  });

  const { data: existingSettings, isLoading } = useQuery({
    queryKey: ["qr-code-settings"],
    queryFn: async () => {
      console.log("Buscando configurações de QR code...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("qr_code_settings")
        .select("*")
        .eq("business_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao buscar configurações:", error);
        throw error;
      }

      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newSettings: QRCodeSettings) => {
      console.log("Salvando configurações:", newSettings);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const settings = {
        ...newSettings,
        business_id: user.id,
      };

      const { data, error } = await supabase
        .from("qr_code_settings")
        .upsert(settings)
        .select()
        .single();

      if (error) {
        console.error("Erro ao salvar configurações:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-code-settings"] });
      toast.success("Configurações salvas com sucesso!");
      setOpen(false);
    },
    onError: (error) => {
      console.error("Erro na mutação:", error);
      toast.error("Erro ao salvar configurações");
    },
  });

  useEffect(() => {
    if (existingSettings) {
      setSettings(existingSettings);
    }
  }, [existingSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(settings);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurações de QR Code</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Cores do QR Code</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="foreground_color" className="text-sm">
                    Cor Principal
                  </Label>
                  <Input
                    id="foreground_color"
                    type="color"
                    value={settings.foreground_color}
                    onChange={(e) =>
                      setSettings({ ...settings, foreground_color: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="background_color" className="text-sm">
                    Cor de Fundo
                  </Label>
                  <Input
                    id="background_color"
                    type="color"
                    value={settings.background_color}
                    onChange={(e) =>
                      setSettings({ ...settings, background_color: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="logo_url">URL do Logo (opcional)</Label>
              <Input
                id="logo_url"
                type="url"
                value={settings.logo_url || ""}
                onChange={(e) =>
                  setSettings({ ...settings, logo_url: e.target.value })
                }
                placeholder="https://exemplo.com/logo.png"
              />
            </div>

            <div>
              <Label htmlFor="custom_text">Texto Personalizado (opcional)</Label>
              <Input
                id="custom_text"
                value={settings.custom_text || ""}
                onChange={(e) =>
                  setSettings({ ...settings, custom_text: e.target.value })
                }
                placeholder="Escaneie para ver em AR"
              />
            </div>

            <div className="border-t pt-4">
              <Label className="text-lg">Página de Destino</Label>
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="landing_page_title">Título</Label>
                  <Input
                    id="landing_page_title"
                    value={settings.landing_page_title || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        landing_page_title: e.target.value,
                      })
                    }
                    placeholder="Experiência AR"
                  />
                </div>

                <div>
                  <Label htmlFor="landing_page_description">Descrição</Label>
                  <Input
                    id="landing_page_description"
                    value={settings.landing_page_description || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        landing_page_description: e.target.value,
                      })
                    }
                    placeholder="Aponte a câmera para a estampa"
                  />
                </div>

                <div>
                  <Label htmlFor="landing_page_primary_color">Cor Principal</Label>
                  <Input
                    id="landing_page_primary_color"
                    type="color"
                    value={settings.landing_page_primary_color}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        landing_page_primary_color: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="landing_page_logo_url">Logo da Página</Label>
                  <Input
                    id="landing_page_logo_url"
                    type="url"
                    value={settings.landing_page_logo_url || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        landing_page_logo_url: e.target.value,
                      })
                    }
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}