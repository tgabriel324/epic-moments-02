import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useARExperience = (stampId: string | undefined, stampData: any) => {
  const [error, setError] = useState<string | null>(null);
  const [interactionId, setInteractionId] = useState<string | null>(null);

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
  }, [stampId, stampData]);

  return { error, setError };
};