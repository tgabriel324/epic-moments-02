import { useEffect, useRef, useState } from "react";
import { ARViewSettings, ARTrackingState, ARVideoState } from "@/types/ar";
import { 
  checkXRSupport, 
  initARSession, 
  setupARCanvas,
  setupImageTracking,
  createVideoMaterial,
  createARScene,
  updateVideoPlane
} from "@/utils/webxr";
import { toast } from "sonner";
import { AROverlay } from "./overlay/AROverlay";
import * as THREE from "three";

interface ARCanvasProps {
  settings: ARViewSettings;
  stampImageUrl?: string;
}

export const ARCanvas = ({ settings, stampImageUrl }: ARCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const [xrSession, setXRSession] = useState<XRSession | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [videoPlane, setVideoPlane] = useState<THREE.Mesh | null>(null);
  
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

  // Inicialização do AR
  useEffect(() => {
    let animationFrameId: number;

    const initAR = async () => {
      try {
        console.log("Iniciando experiência AR...");
        
        const isSupported = await checkXRSupport();
        if (!isSupported) {
          throw new Error("AR não suportado neste dispositivo");
        }

        if (!canvasRef.current || !overlayRef.current) {
          throw new Error("Canvas ou overlay não encontrado");
        }

        // Setup Three.js
        const newRenderer = setupARCanvas(canvasRef.current);
        const newScene = createARScene();
        
        setRenderer(newRenderer);
        setScene(newScene);

        // Iniciar sessão AR
        const session = await initARSession(overlayRef.current);
        setXRSession(session);

        // Solicitar referenceSpace
        const referenceSpace = await session.requestReferenceSpace("local");

        // Setup tracking de imagem
        if (stampImageUrl) {
          const trackingResult = await setupImageTracking(stampImageUrl);
          if (!trackingResult.success) {
            throw new Error(trackingResult.error);
          }

          // Criar plano para o vídeo
          const geometry = new THREE.PlaneGeometry(1, 1);
          const material = createVideoMaterial(videoRef.current!);
          const plane = new THREE.Mesh(geometry, material);
          newScene.add(plane);
          setVideoPlane(plane);
        }

        // Loop de renderização
        const onXRFrame = (time: number, frame: XRFrame) => {
          const pose = frame.getViewerPose(referenceSpace);
          
          if (pose) {
            const view = pose.views[0];
            const viewport = session.renderState.baseLayer!.getViewport(view);
            
            newRenderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
            newRenderer.setSize(viewport.width, viewport.height);
            newRenderer.render(newScene, view as any);

            // Atualizar estado de tracking
            setTracking({
              isTracking: true,
              confidence: 1.0
            });

            // Atualizar transformações do vídeo
            if (videoPlane) {
              updateVideoPlane(videoPlane, scale, rotation);
            }
          } else {
            setTracking({
              isTracking: false,
              confidence: 0
            });
          }
          
          animationFrameId = session.requestAnimationFrame(onXRFrame);
        };

        animationFrameId = session.requestAnimationFrame(onXRFrame);
        
        console.log("Experiência AR iniciada com sucesso");
      } catch (error) {
        console.error("Erro ao iniciar AR:", error);
        toast.error(error instanceof Error ? error.message : "Erro ao iniciar experiência AR");
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
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [stampImageUrl]);

  // Handlers de vídeo
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

  // Handlers de transformação
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
        className="w-full h-full absolute inset-0"
      />
      
      <div ref={overlayRef}>
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
    </div>
  );
};