import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARCanvas } from "@/components/ar/ARCanvas";
import { TrackingFeedback } from "@/components/ar/tracking/TrackingFeedback";
import { useIsMobile } from "@/hooks/use-mobile";

const Scanner = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const initScanner = async () => {
      try {
        console.log("Iniciando scanner AR...");
        
        // Configuração específica para iOS Safari
        const constraints = {
          video: {
            facingMode: 'environment', // Usa a câmera traseira
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        console.log("Solicitando permissão da câmera com constraints:", constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          console.log("Stream obtido, configurando vídeo...");
          videoRef.current.srcObject = stream;
          
          // Eventos específicos para debug
          videoRef.current.onloadedmetadata = () => {
            console.log("Metadados do vídeo carregados");
            videoRef.current?.play().catch(e => {
              console.error("Erro ao iniciar playback:", e);
            });
          };
          
          videoRef.current.onplay = () => {
            console.log("Vídeo iniciou playback");
          };
          
          videoRef.current.onerror = (e) => {
            console.error("Erro no elemento de vídeo:", e);
          };
        }

        setHasPermission(true);
        setIsLoading(false);
        console.log("Scanner AR iniciado com sucesso");
      } catch (error) {
        console.error("Erro ao iniciar scanner:", error);
        toast.error("Erro ao acessar a câmera");
        setHasPermission(false);
        setIsLoading(false);
      }
    };

    initScanner();

    // Cleanup
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [navigate]);

  const handleBack = () => {
    console.log("Voltando para o dashboard");
    navigate("/user/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <Camera className="h-12 w-12 md:h-16 md:w-16 mb-4 text-[#00BFFF]" />
        <h2 className="text-lg md:text-xl font-bold mb-2 text-center">
          Permissão Necessária
        </h2>
        <p className="text-sm md:text-base text-center mb-4 max-w-xs md:max-w-sm">
          Para usar o scanner AR, precisamos de acesso à sua câmera.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="w-full max-w-xs md:max-w-sm text-sm md:text-base py-2 md:py-3"
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        className={`absolute top-safe-2 left-2 z-50 text-white 
          ${isMobile ? 'p-2' : 'p-4'}`}
        onClick={handleBack}
      >
        <ArrowLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2`} />
        <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>Voltar</span>
      </Button>

      {/* Video elemento para preview da câmera */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        autoPlay
        muted
        webkit-playsinline="true"
      />

      {/* Feedback de Tracking */}
      <TrackingFeedback 
        tracking={{
          isTracking: false,
          confidence: 0,
          status: 'searching'
        }} 
      />
    </div>
  );
};

export default Scanner;