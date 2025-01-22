import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QRCodeColorSettings } from "./qr/QRCodeColorSettings";
import { QRCodeLogoSettings } from "./qr/QRCodeLogoSettings";
import { QRCodeCustomText } from "./qr/QRCodeCustomText";
import { QRCodeLandingPageSettings } from "./qr/QRCodeLandingPageSettings";

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
            <QRCodeColorSettings
              foregroundColor={settings.foreground_color}
              backgroundColor={settings.background_color}
              onForegroundColorChange={(value) =>
                setSettings({ ...settings, foreground_color: value })
              }
              onBackgroundColorChange={(value) =>
                setSettings({ ...settings, background_color: value })
              }
            />

            <QRCodeLogoSettings
              logoUrl={settings.logo_url}
              onLogoUrlChange={(value) =>
                setSettings({ ...settings, logo_url: value })
              }
            />

            <QRCodeCustomText
              customText={settings.custom_text}
              onCustomTextChange={(value) =>
                setSettings({ ...settings, custom_text: value })
              }
            />

            <QRCodeLandingPageSettings
              title={settings.landing_page_title}
              description={settings.landing_page_description}
              primaryColor={settings.landing_page_primary_color}
              logoUrl={settings.landing_page_logo_url}
              onTitleChange={(value) =>
                setSettings({ ...settings, landing_page_title: value })
              }
              onDescriptionChange={(value) =>
                setSettings({ ...settings, landing_page_description: value })
              }
              onPrimaryColorChange={(value) =>
                setSettings({ ...settings, landing_page_primary_color: value })
              }
              onLogoUrlChange={(value) =>
                setSettings({ ...settings, landing_page_logo_url: value })
              }
            />
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