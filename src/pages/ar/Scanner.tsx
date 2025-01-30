import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Scanner = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initScanner = async () => {
      try {
        console.log("Iniciando scanner...");
        // Aqui vamos adicionar a lógica do scanner
        const hasCamera = await checkCameraPermission();
        
        if (!hasCamera) {
          toast.error("Permissão de câmera necessária para escanear");
          navigate("/user/dashboard");
          return;
        }

        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900">Scanner AR</h1>
        <p className="mt-2 text-gray-600">
          Aponte a câmera para uma estampa para iniciar a experiência AR
        </p>
      </div>
      
      <div className="relative aspect-video max-w-2xl mx-auto mt-4">
        <video
          id="scanner-video"
          className="w-full h-full object-cover rounded-lg"
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
};

export default Scanner;