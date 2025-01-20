import { useEffect, useRef, useState } from "react";
import { ARViewSettings } from "@/types/ar";
import { checkXRSupport, initARSession, setupARCanvas } from "@/utils/webxr";
import { toast } from "sonner";

interface ARCanvasProps {
  settings: ARViewSettings;
}

export const ARCanvas = ({ settings }: ARCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let xrSession: XRSession | null = null;
    let animationFrameId: number;

    const initAR = async () => {
      try {
        console.log("Iniciando experiência AR...");
        
        // Verificar suporte WebXR
        const isSupported = await checkXRSupport();
        if (!isSupported) return;

        // Configurar canvas
        if (!canvasRef.current) {
          console.error("Canvas não encontrado");
          return;
        }

        const gl = setupARCanvas(canvasRef.current);
        
        // Iniciar sessão AR
        xrSession = await initARSession();
        
        // Setup render loop
        const onXRFrame = (time: number, frame: XRFrame) => {
          // Atualizar tracking status
          const pose = frame.getViewerPose(referenceSpace);
          setIsTracking(!!pose);
          
          // Continuar loop de renderização
          animationFrameId = session.requestAnimationFrame(onXRFrame);
        };

        // Iniciar loop de renderização
        animationFrameId = xrSession.requestAnimationFrame(onXRFrame);
        
        console.log("Experiência AR iniciada com sucesso");
      } catch (error) {
        console.error("Erro ao iniciar AR:", error);
        toast.error("Erro ao iniciar experiência AR");
      }
    };

    initAR();

    // Cleanup
    return () => {
      if (xrSession) {
        console.log("Encerrando sessão AR...");
        xrSession.end().catch(console.error);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

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
      
      <canvas
        ref={canvasRef}
        id="ar-canvas"
        className="w-full h-full absolute inset-0"
      />
      
      {/* Overlay para UI e feedback */}
      <div id="ar-overlay" className="absolute inset-0 pointer-events-none">
        {/* Logo */}
        {settings.landing_page_logo_url && (
          <div className="absolute top-4 left-4 right-4">
            <img 
              src={settings.landing_page_logo_url} 
              alt="Logo"
              className="h-12 object-contain"
            />
          </div>
        )}
        
        {/* Feedback de tracking */}
        {!isTracking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 p-4 rounded-lg backdrop-blur-sm text-white">
              <p>Procurando superfície...</p>
            </div>
          </div>
        )}
        
        {/* Descrição */}
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
    </div>
  );
};