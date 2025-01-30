import { useEffect, useState } from "react";
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
  const isMobile = useIsMobile();

  useEffect(() => {
    const initScanner = async () => {
      try {
        console.log("Iniciando scanner AR...");
        const hasCamera = await checkCameraPermission();
        
        if (!hasCamera) {
          console.error("Permissão de câmera negada");
          toast.error("Permissão de câmera necessária para escanear");
          navigate("/user/dashboard");
          return;
        }

        setHasPermission(true);
        setIsLoading(false);
        console.log("Scanner AR iniciado com sucesso");
      } catch (error) {
        console.error("Erro ao iniciar scanner:", error);
        toast.error("Erro ao iniciar scanner");
        navigate("/user/dashboard");
      }
    };

    initScanner();
  }, [navigate]);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  };

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

  // Configurações padrão para a experiência AR
  const defaultSettings = {
    background_color: "black",
    landing_page_primary_color: "#00BFFF",
    landing_page_title: "Scanner AR",
    landing_page_description: "Aponte a câmera para uma estampa para começar"
  };

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

      {/* Canvas AR */}
      <ARCanvas settings={defaultSettings} />

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