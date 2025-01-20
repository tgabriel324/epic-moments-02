import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const ARView = () => {
  const { stampId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [interactionId, setInteractionId] = useState<string | null>(null);

  // Validar UUID antes da query
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const { data: stampData, isLoading } = useQuery({
    queryKey: ["stamp", stampId],
    queryFn: async () => {
      if (!stampId || !isValidUUID(stampId)) {
        console.error("ID da estampa inválido:", stampId);
        const error = new Error("ID da estampa inválido");
        toast.error(error.message);
        setTimeout(() => navigate("/"), 3000);
        throw error;
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

      if (stampError || !stamp) {
        console.error("Erro ao buscar estampa:", stampError);
        const error = new Error("Estampa não encontrada");
        toast.error(error.message);
        setTimeout(() => navigate("/"), 3000);
        throw error;
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
    enabled: !!stampId,
    retry: false
  });

  useEffect(() => {
    const initAR = async () => {
      try {
        if (!stampData?.stamp) return;
        console.log("Iniciando experiência AR para estampa:", stampData.stamp);

        // Registrar início da interação
        const { data: interaction, error: interactionError } = await supabase
          .from("ar_interactions")
          .insert({
            stamp_id: stampId,
            video_id: stampData.stamp.stamp_video_links[0].video_id,
            user_agent: navigator.userAgent,
            device_info: JSON.stringify({
              platform: navigator.platform,
              vendor: navigator.vendor,
            }),
            status: "started"
          })
          .select()
          .single();

        if (interactionError) {
          console.error("Erro ao registrar interação:", interactionError);
          throw new Error("Erro ao iniciar experiência AR");
        }

        setInteractionId(interaction.id);
        
        // Verificar suporte WebXR
        if ("xr" in navigator) {
          const isArSupported = await (navigator as any).xr?.isSessionSupported(
            "immersive-ar"
          );
          if (!isArSupported) {
            throw new Error(
              "Seu dispositivo não suporta Realidade Aumentada"
            );
          }
          
          console.log("Dispositivo suporta AR, iniciando sessão...");
          // Aqui vamos iniciar a sessão AR quando implementarmos o tracking
        } else {
          throw new Error("WebXR não está disponível neste navegador");
        }

      } catch (err) {
        console.error("Erro na inicialização AR:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        toast.error(err instanceof Error ? err.message : "Erro desconhecido");
      }
    };

    if (stampData?.stamp) {
      initAR();
    }

    // Cleanup
    return () => {
      if (interactionId) {
        console.log("Finalizando interação AR:", interactionId);
        supabase
          .from("ar_interactions")
          .update({
            status: "completed",
            duration: Math.floor(
              (Date.now() - new Date().getTime()) / 1000
            ),
          })
          .eq("id", interactionId)
          .then(({ error }) => {
            if (error) {
              console.error("Erro ao finalizar interação:", error);
            }
          });
      }
    };
  }, [stampId, stampData, navigate]);

  // Default values for settings
  const defaultSettings = {
    background_color: "black",
    landing_page_primary_color: "#00BFFF",
    landing_page_title: "Iniciando experiência AR...",
    landing_page_description: "Aponte a câmera para a estampa para visualizar o conteúdo em AR"
  };

  // Merge default settings with actual settings
  const settings = {
    ...defaultSettings,
    ...stampData?.settings
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{
        backgroundColor: settings.background_color
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{
            borderColor: settings.landing_page_primary_color
          }}></div>
          <p className="mt-4" style={{
            color: settings.landing_page_primary_color
          }}>
            {settings.landing_page_title}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{
        backgroundColor: settings.background_color
      }}>
        <div className="text-center px-4">
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg hover:opacity-90"
            style={{
              backgroundColor: settings.landing_page_primary_color,
              color: "white"
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{
      backgroundColor: settings.background_color
    }}>
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        webkit-playsinline="true"
      />
      <canvas id="ar-canvas" className="w-full h-full absolute inset-0" />
      
      {settings.landing_page_logo_url && (
        <div className="absolute top-4 left-4 right-4">
          <img 
            src={settings.landing_page_logo_url} 
            alt="Logo"
            className="h-12 object-contain"
          />
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 p-4 rounded-lg backdrop-blur-sm" style={{
          color: settings.landing_page_primary_color
        }}>
          <p className="text-sm">
            {settings.landing_page_description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ARView;