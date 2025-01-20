import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/ar/LoadingScreen";
import { ErrorScreen } from "@/components/ar/ErrorScreen";
import { ARCanvas } from "@/components/ar/ARCanvas";
import { useARExperience } from "@/hooks/useARExperience";
import type { ARViewSettings } from "@/types/ar";

const ARView = () => {
  const { stampId } = useParams();
  const navigate = useNavigate();

  // Validar UUID antes da query
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const { data: stampData, isLoading, error: queryError } = useQuery({
    queryKey: ["stamp", stampId],
    queryFn: async () => {
      if (!stampId || !isValidUUID(stampId)) {
        console.error("ID da estampa inválido:", stampId);
        return null;
      }
      
      console.log("Buscando dados da estampa:", stampId);
      const { data: stamp, error: stampError } = await supabase
        .from("stamps")
        .select(`
          *,
          stamp_video_links!inner(
            video_id,
            videos(*)
          )
        `)
        .eq("id", stampId)
        .maybeSingle();

      if (stampError) {
        console.error("Erro ao buscar estampa:", stampError);
        throw stampError;
      }

      if (!stamp) {
        console.error("Estampa não encontrada");
        return null;
      }

      // Buscar configurações de QR code do negócio
      console.log("Buscando configurações de QR code:", stamp.business_id);
      const { data: settings, error: settingsError } = await supabase
        .from("qr_code_settings")
        .select("*")
        .eq("business_id", stamp.business_id)
        .single();

      if (settingsError && settingsError.code !== "PGRST116") {
        console.error("Erro ao buscar configurações:", settingsError);
      }

      return { stamp, settings };
    },
    retry: false
  });

  // Se não encontrou dados válidos, mostra erro
  if (queryError || !stampData) {
    const errorMessage = "Estampa não encontrada ou ID inválido";
    toast.error(errorMessage);
    
    // Redireciona após 3 segundos para dar tempo de ler a mensagem
    setTimeout(() => {
      navigate("/");
    }, 3000);

    // Mostra tela de erro enquanto aguarda redirecionamento
    return (
      <ErrorScreen 
        settings={{
          background_color: "black",
          landing_page_primary_color: "#00BFFF",
          landing_page_title: "Erro",
          landing_page_description: errorMessage
        }} 
        error={errorMessage} 
      />
    );
  }

  const { error: arError } = useARExperience(stampId, stampData);

  // Default values for settings
  const defaultSettings: ARViewSettings = {
    background_color: "black",
    landing_page_primary_color: "#00BFFF",
    landing_page_title: "Iniciando experiência AR...",
    landing_page_description: "Aponte a câmera para a estampa para visualizar o conteúdo em AR"
  };

  // Merge default settings with actual settings
  const settings: ARViewSettings = {
    ...defaultSettings,
    ...stampData?.settings
  };

  if (isLoading) {
    return <LoadingScreen settings={settings} />;
  }

  if (arError) {
    return <ErrorScreen settings={settings} error={arError} />;
  }

  return <ARCanvas settings={settings} />;
};

export default ARView;