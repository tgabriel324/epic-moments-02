import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ARView = () => {
  const { stampId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interactionId, setInteractionId] = useState<string | null>(null);

  useEffect(() => {
    const initAR = async () => {
      try {
        console.log("Iniciando experiência AR para stamp:", stampId);
        
        // Buscar informações da estampa e vídeo
        const { data: stampData, error: stampError } = await supabase
          .from("stamps")
          .select(`
            *,
            stamp_video_links!inner(
              video_id,
              videos(*)
            )
          `)
          .eq("id", stampId)
          .single();

        if (stampError) {
          console.error("Erro ao buscar estampa:", stampError);
          throw new Error("Estampa não encontrada");
        }

        // Registrar início da interação
        const { data: interaction, error: interactionError } = await supabase
          .from("ar_interactions")
          .insert({
            stamp_id: stampId,
            video_id: stampData.stamp_video_links[0].video_id,
            user_agent: navigator.userAgent,
            device_info: JSON.stringify({
              platform: navigator.platform,
              vendor: navigator.vendor,
            }),
          })
          .select()
          .single();

        if (interactionError) {
          console.error("Erro ao registrar interação:", interactionError);
          throw new Error("Erro ao iniciar experiência AR");
        }

        setInteractionId(interaction.id);
        
        // Inicializar WebXR
        if ("xr" in navigator) {
          const isArSupported = await (navigator as any).xr?.isSessionSupported(
            "immersive-ar"
          );
          if (!isArSupported) {
            throw new Error(
              "Seu dispositivo não suporta Realidade Aumentada"
            );
          }
        } else {
          throw new Error("WebXR não está disponível neste navegador");
        }

        setLoading(false);
      } catch (err) {
        console.error("Erro na inicialização AR:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setLoading(false);
      }
    };

    initAR();

    // Cleanup
    return () => {
      if (interactionId) {
        // Atualizar duração da interação
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
  }, [stampId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Iniciando experiência AR...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center px-4">
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00BFFF] text-white px-6 py-2 rounded-lg hover:bg-[#00BFFF]/90"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        webkit-playsinline="true"
      />
      <canvas id="ar-canvas" className="w-full h-full absolute inset-0" />
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 text-white p-4 rounded-lg backdrop-blur-sm">
          <p className="text-sm">
            Aponte a câmera para a estampa para visualizar o conteúdo em AR
          </p>
        </div>
      </div>
    </div>
  );
};

export default ARView;