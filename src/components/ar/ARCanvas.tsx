import { useEffect, useRef, useState } from "react";
import { ARViewSettings, ARTrackingState, ARVideoState } from "@/types/ar";
import { checkXRSupport, initARSession, setupARCanvas } from "@/utils/webxr";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Pause, Play, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface ARCanvasProps {
  settings: ARViewSettings;
}

export const ARCanvas = ({ settings }: ARCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [xrSession, setXRSession] = useState<XRSession | null>(null);
  const [xrReferenceSpace, setXRReferenceSpace] = useState<XRReferenceSpace | null>(null);
  
  // Estados de tracking e vídeo
  const [tracking, setTracking] = useState<ARTrackingState>({
    isTracking: false,
    confidence: 0
  });
  
  const [videoState, setVideoState] = useState<ARVideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });

  // Estados de transformação
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
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
        const session = await initARSession();
        setXRSession(session);
        
        // Configurar reference space
        const referenceSpace = await session.requestReferenceSpace('local');
        setXRReferenceSpace(referenceSpace);
        
        // Setup render loop
        const onXRFrame = (time: number, frame: XRFrame) => {
          // Atualizar tracking status
          const pose = frame.getViewerPose(referenceSpace);
          const newConfidence = pose ? 1.0 : 0;
          
          setTracking({
            isTracking: !!pose,
            confidence: newConfidence
          });
          
          // Continuar loop de renderização
          animationFrameId = session.requestAnimationFrame(onXRFrame);
        };

        // Iniciar loop de renderização
        animationFrameId = session.requestAnimationFrame(onXRFrame);
        
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

  // Handlers de controle de vídeo
  const togglePlayback = () => {
    if (!videoRef.current) return;
    
    if (videoState.isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setVideoState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    setVideoState(prev => ({
      ...prev,
      currentTime: videoRef.current?.currentTime || 0
    }));
  };

  // Handlers de transformação
  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  const handleRotationReset = () => {
    setRotation(0);
  };

  return (
    <div className="relative min-h-screen" style={{
      backgroundColor: settings.background_color
    }}>
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        webkit-playsinline="true"
        onTimeUpdate={handleTimeUpdate}
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
        {!tracking.isTracking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 p-4 rounded-lg backdrop-blur-sm text-white">
              <p>Procurando superfície...</p>
              <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${tracking.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Controles de vídeo e transformação */}
        <div className="absolute bottom-24 left-4 right-4 pointer-events-auto">
          <div className="bg-black/50 p-4 rounded-lg backdrop-blur-sm space-y-4">
            {/* Controles de vídeo */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayback}
                className="bg-white/10"
              >
                {videoState.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Slider
                value={[videoState.currentTime]}
                max={videoState.duration}
                step={0.1}
                className="flex-1"
              />
            </div>
            
            {/* Controles de transformação */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                className="bg-white/10"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <Slider
                value={[scale]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={handleScaleChange}
                className="flex-1"
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                className="bg-white/10"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleRotationReset}
                className="bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
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