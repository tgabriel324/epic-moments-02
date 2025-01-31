import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackingFeedback } from "@/components/ar/tracking/TrackingFeedback";
import { useIsMobile } from "@/hooks/use-mobile";

const Scanner = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const initScanner = async () => {
      try {
        console.log("Iniciando scanner AR...");
        setError(null);
        
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight }
          }
        };

        console.log("Solicitando permissão da câmera com constraints:", constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          console.log("Stream obtido, configurando vídeo...");
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            console.log("Metadados do vídeo carregados");
            setHasPermission(true);
            setIsLoading(false);
          };

          videoRef.current.onerror = (e) => {
            console.error("Erro no elemento de vídeo:", e);
            setError("Erro ao inicializar câmera");
            setIsLoading(false);
          };
          
          try {
            await videoRef.current.play();
            console.log("Vídeo iniciou playback com sucesso");
          } catch (playError) {
            console.error("Erro ao iniciar playback:", playError);
            setError("Erro ao iniciar câmera");
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Erro ao iniciar scanner:", error);
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          setError("Permissão da câmera negada");
        } else {
          setError("Erro ao acessar a câmera");
        }
        setHasPermission(false);
        setIsLoading(false);
      }
    };

    initScanner();

    return () => {
      console.log("Limpando recursos da câmera...");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  const handleBack = () => {
    console.log("Voltando para o dashboard");
    navigate("/user/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500 mx-auto" />
          <p className="text-white text-sm">Iniciando câmera...</p>
        </div>
      </div>
    );
  }

  if (error || !hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <Camera className="h-12 w-12 md:h-16 md:w-16 mb-4 text-cyan-500" />
        <h2 className="text-lg md:text-xl font-bold mb-2 text-center">
          {error || "Permissão Necessária"}
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
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Container do vídeo - ocupa toda a tela */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted
          webkit-playsinline="true"
        />
      </div>

      {/* Overlay com controles e feedback */}
      <div className="relative z-10">
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

        {/* Feedback de Tracking centralizado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <TrackingFeedback
            tracking={{
              isTracking: false,
              confidence: 0,
              status: 'searching'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Scanner;