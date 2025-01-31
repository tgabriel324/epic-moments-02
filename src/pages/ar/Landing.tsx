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

  const { data: stampData, isLoading, error: queryError } = useQuery({
    queryKey: ["landing-page", stampId],
    queryFn: async () => {
      if (!stampId) {
        console.error("ID da estampa não fornecido");
        throw new Error("ID da estampa não fornecido");
      }

      console.log("Buscando dados da estampa:", stampId);

      // Buscar configurações do QR code e dados da estampa
      const { data: settings, error: settingsError } = await supabase
        .from("qr_code_settings")
        .select("*")
        .maybeSingle();

      if (settingsError) {
        console.error("Erro ao buscar configurações:", settingsError);
      }

      const { data: stamp, error: stampError } = await supabase
        .from("stamps")
        .select("*, business:profiles(company_name), stamp_video_links(video_id)")
        .eq("id", stampId)
        .maybeSingle();

      if (stampError) {
        console.error("Erro ao buscar dados da estampa:", stampError);
        throw stampError;
      }

      if (!stamp) {
        console.error("Estampa não encontrada");
        throw new Error("Estampa não encontrada");
      }

      console.log("Dados da estampa recuperados:", stamp);
      return {
        settings: settings || defaultSettings,
        stamp,
      };
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const { error: arError } = useARExperience(stampId, stampData);

  console.log("Estado atual:", { isLoading, stampData, arError, queryError });

  if (isLoading) {
    return <LoadingScreen settings={defaultSettings} />;
  }

  if (queryError || arError || !stampData?.stamp) {
    const errorMessage = queryError?.message || arError || "Estampa não encontrada";
    console.error("Erro na experiência AR:", errorMessage);
    return (
      <ErrorScreen
        error={errorMessage}
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