import { useEffect, useRef, useState } from "react";
import { ARViewSettings, ARTrackingState, ARVideoState } from "@/types/ar";
import { checkXRSupport, initARSession, setupARCanvas } from "@/utils/webxr";
import { toast } from "sonner";
import { AROverlay } from "./overlay/AROverlay";

interface ARCanvasProps {
  settings: ARViewSettings;
}

export const ARCanvas = ({ settings }: ARCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [xrSession, setXRSession] = useState<XRSession | null>(null);
  const [xrReferenceSpace, setXRReferenceSpace] = useState<XRReferenceSpace | null>(null);
  
  // Estados
  const [tracking, setTracking] = useState<ARTrackingState>({
    isTracking: false,
    confidence: 0
  });
  
  const [videoState, setVideoState] = useState<ARVideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const initAR = async () => {
      try {
        console.log("Iniciando experiência AR...");
        
        const isSupported = await checkXRSupport();
        if (!isSupported) return;

        if (!canvasRef.current) {
          console.error("Canvas não encontrado");
          return;
        }

        const gl = setupARCanvas(canvasRef.current);
        
        const session = await initARSession();
        setXRSession(session);
        
        const referenceSpace = await session.requestReferenceSpace('local');
        setXRReferenceSpace(referenceSpace);
        
        const onXRFrame = (time: number, frame: XRFrame) => {
          const pose = frame.getViewerPose(referenceSpace);
          const newConfidence = pose ? 1.0 : 0;
          
          setTracking({
            isTracking: !!pose,
            confidence: newConfidence
          });
          
          animationFrameId = session.requestAnimationFrame(onXRFrame);
        };

        animationFrameId = session.requestAnimationFrame(onXRFrame);
        
        console.log("Experiência AR iniciada com sucesso");
      } catch (error) {
        console.error("Erro ao iniciar AR:", error);
        toast.error("Erro ao iniciar experiência AR");
      }
    };

    initAR();

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

  // Handlers
  const handlePlayPause = () => {
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

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(2, prev + 0.1));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.1));
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
      
      <AROverlay 
        settings={settings}
        tracking={tracking}
        videoState={videoState}
        scale={scale}
        onPlayPause={handlePlayPause}
        onScaleChange={handleScaleChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotationReset={handleRotationReset}
      />
    </div>
  );
};