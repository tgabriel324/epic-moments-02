import { useState, useEffect } from "react";
import * as THREE from "three";
import { ARSceneState, ARTrackingState } from "@/types/ar";
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

export const useARScene = (
  stampImageUrl?: string,
  videoRef?: React.RefObject<HTMLVideoElement>,
  overlayRef?: React.RefObject<HTMLDivElement>
) => {
  const [sceneState, setSceneState] = useState<ARSceneState>({
    xrSession: null,
    renderer: null,
    scene: null,
    videoPlane: null
  });

  const [tracking, setTracking] = useState<ARTrackingState>({
    isTracking: false,
    confidence: 0
  });

  useEffect(() => {
    let animationFrameId: number;

    const initAR = async () => {
      try {
        console.log("Iniciando experiência AR...");
        
        const isSupported = await checkXRSupport();
        if (!isSupported) {
          throw new Error("AR não suportado neste dispositivo");
        }

        if (!overlayRef?.current) {
          throw new Error("Overlay não encontrado");
        }

        // Setup Three.js
        const renderer = setupARCanvas(overlayRef.current);
        const scene = createARScene();
        
        // Iniciar sessão AR
        const session = await initARSession(overlayRef.current);
        
        // Setup tracking de imagem
        if (stampImageUrl && videoRef?.current) {
          const trackingResult = await setupImageTracking(stampImageUrl);
          if (!trackingResult.success) {
            throw new Error(trackingResult.error);
          }

          // Criar plano para o vídeo
          const geometry = new THREE.PlaneGeometry(1, 1);
          const material = createVideoMaterial(videoRef.current);
          const plane = new THREE.Mesh(geometry, material);
          scene.add(plane);

          setSceneState({
            xrSession: session,
            renderer,
            scene,
            videoPlane: plane
          });
        }

        console.log("Experiência AR iniciada com sucesso");
      } catch (error) {
        console.error("Erro ao iniciar AR:", error);
        toast.error(error instanceof Error ? error.message : "Erro ao iniciar experiência AR");
      }
    };

    initAR();

    return () => {
      if (sceneState.xrSession) {
        console.log("Encerrando sessão AR...");
        sceneState.xrSession.end().catch(console.error);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (sceneState.renderer) {
        sceneState.renderer.dispose();
      }
    };
  }, [stampImageUrl]);

  return { sceneState, tracking, setTracking };
};