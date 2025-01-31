import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ARCanvas } from "@/components/ar/ARCanvas";
import { LoadingScreen } from "@/components/ar/LoadingScreen";
import { ErrorScreen } from "@/components/ar/ErrorScreen";
import { useARExperience } from "@/hooks/useARExperience";
import { ARViewSettings } from "@/types/ar";

const defaultSettings: ARViewSettings = {
  background_color: "#000000",
  landing_page_primary_color: "#00BFFF",
  landing_page_title: "Experiência AR",
  landing_page_description: "Aponte a câmera para a estampa"
};

export default function Landing() {
  const { stampId } = useParams();
  console.log("Iniciando experiência AR para estampa:", stampId);

  const { data: stampData, isLoading } = useQuery({
    queryKey: ["landing-page", stampId],
    queryFn: async () => {
      if (!stampId) throw new Error("ID da estampa não fornecido");

      // Buscar configurações do QR code e dados da estampa
      const { data: settings } = await supabase
        .from("qr_code_settings")
        .select("*")
        .maybeSingle();

      const { data: stamp, error } = await supabase
        .from("stamps")
        .select("*, business:profiles(company_name), stamp_video_links(video_id)")
        .eq("id", stampId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar dados da estampa:", error);
        throw error;
      }

      if (!stamp) {
        throw new Error("Estampa não encontrada");
      }

      return {
        settings: settings || defaultSettings,
        stamp,
      };
    },
  });

  const { error } = useARExperience(stampId, stampData);

  if (isLoading) {
    return (
      <LoadingScreen
        settings={defaultSettings}
      />
    );
  }

  if (error || !stampData?.stamp) {
    return (
      <ErrorScreen
        error={error || "Estampa não encontrada"}
        settings={stampData?.settings || defaultSettings}
      />
    );
  }

  return (
    <ARCanvas
      settings={stampData.settings || defaultSettings}
      stampImageUrl={stampData.stamp.optimized_tracking_url || stampData.stamp.image_url}
    />
  );
}