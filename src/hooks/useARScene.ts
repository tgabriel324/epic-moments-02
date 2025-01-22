import { useState, useEffect, useCallback, useRef } from "react";
import * as THREE from "three";
import { ARSceneState, ARTrackingState } from "@/types/ar";
import {
  checkXRSupport,
  setupARCanvas,
  createARScene,
  setupARCamera,
  initARSession,
  setupImageTracking,
  handleResize,
  createVideoMaterial
} from "@/utils/webxr";
import { toast } from "sonner";

interface UseARSceneConfig {
  stampImageUrl?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
}

export const useARScene = ({
  stampImageUrl,
  videoRef,
  canvasRef,
  overlayRef
}: UseARSceneConfig) => {
  const [sceneState, setSceneState] = useState<ARSceneState>({
    xrSession: null,
    renderer: null,
    scene: null,
    camera: null,
    videoPlane: null
  });

  const [tracking, setTracking] = useState<ARTrackingState>({
    isTracking: false,
    confidence: 0
  });

  // Refs para performance e tracking
  const frameId = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const trackingAttempts = useRef<number>(0);
  const lastTrackingSuccess = useRef<number>(0);

  // Função para atualizar o estado de tracking com fallback
  const updateTracking = useCallback((confidence: number, error?: string) => {
    const now = Date.now();
    
    // Se não detectou por muito tempo, incrementa tentativas
    if (confidence < 0.5) {
      trackingAttempts.current++;
      
      // Após 5 tentativas sem sucesso, sugere ajustes
      if (trackingAttempts.current > 5) {
        setTracking(prev => ({
          ...prev,
          error: "Tente ajustar a iluminação ou distância da estampa",
          confidence: confidence
        }));
      }
    } else {
      // Reset tentativas quando há sucesso
      trackingAttempts.current = 0;
      lastTrackingSuccess.current = now;
    }

    // Atualiza estado do tracking
    setTracking(prev => ({
      isTracking: confidence > 0.7,
      confidence,
      lastUpdate: now,
      error: error || (confidence < 0.3 ? "Estampa não encontrada" : undefined)
    }));

    // Log para debug
    console.log(`Tracking update - Confidence: ${confidence}, Attempts: ${trackingAttempts.current}`);
  }, []);

  // Função para atualizar a posição do vídeo com smoothing
  const updateVideoPosition = useCallback((pose: XRPose) => {
    if (!sceneState.videoPlane) return;

    const { position, orientation } = pose.transform;
    
    // Aplica smoothing na posição
    const smoothFactor = 0.1;
    const currentPos = sceneState.videoPlane.position;
    
    currentPos.x += (position.x - currentPos.x) * smoothFactor;
    currentPos.y += (position.y - currentPos.y) * smoothFactor;
    currentPos.z += (position.z - currentPos.z) * smoothFactor;
    
    // Aplica orientação
    sceneState.videoPlane.quaternion.set(
      orientation.x,
      orientation.y,
      orientation.z,
      orientation.w
    );

    sceneState.videoPlane.updateMatrix();
  }, [sceneState.videoPlane]);

  const initAR = useCallback(async () => {
    try {
      console.log("Iniciando experiência AR...");
      
      if (!overlayRef?.current || !videoRef?.current || !canvasRef?.current) {
        throw new Error("Referências não encontradas");
      }

      // Setup Three.js
      const renderer = setupARCanvas(canvasRef.current);
      const scene = createARScene();
      const camera = setupARCamera();
      
      // Iniciar sessão AR
      const session = await initARSession(overlayRef.current);
      
      // Setup tracking de imagem
      if (stampImageUrl) {
        console.log("Configurando tracking de imagem:", stampImageUrl);
        const trackingResult = await setupImageTracking(stampImageUrl);
        
        if (!trackingResult.success) {
          throw new Error(trackingResult.error);
        }

        // Criar plano para o vídeo com dimensões otimizadas
        const geometry = new THREE.PlaneGeometry(1, 1);
        geometry.computeBoundingSphere();
        
        const material = createVideoMaterial(videoRef.current);
        const plane = new THREE.Mesh(geometry, material);
        plane.matrixAutoUpdate = false;
        scene.add(plane);

        setSceneState({
          xrSession: session,
          renderer,
          scene,
          camera,
          videoPlane: plane
        });

        console.log("Cena AR configurada com sucesso");
        toast.success("AR iniciado com sucesso");
      }

      // Listener para redimensionamento
      const handleResizeEvent = () => handleResize(camera, renderer);
      window.addEventListener("resize", handleResizeEvent);

      // Loop de animação otimizado
      const animate = (time: number) => {
        frameId.current = requestAnimationFrame(animate);
        
        // Calcular FPS para debug
        frameCount.current++;
        if (time - lastFrameTime.current >= 1000) {
          const fps = Math.round((frameCount.current * 1000) / (time - lastFrameTime.current));
          console.log("FPS:", fps);
          frameCount.current = 0;
          lastFrameTime.current = time;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      frameId.current = requestAnimationFrame(animate);
      
      return () => {
        window.removeEventListener("resize", handleResizeEvent);
        if (session) session.end().catch(console.error);
        if (renderer) renderer.dispose();
        if (frameId.current) cancelAnimationFrame(frameId.current);
      };
    } catch (error) {
      console.error("Erro ao iniciar AR:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao iniciar experiência AR");
      setTracking({ 
        isTracking: false, 
        confidence: 0,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  }, [stampImageUrl, videoRef, canvasRef, overlayRef]);

  useEffect(() => {
    const cleanup = initAR();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [initAR]);

  return { 
    sceneState, 
    tracking, 
    updateTracking,
    updateVideoPosition 
  };
};