import { useState, useEffect, useCallback } from "react";
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

export const useARScene = (
  stampImageUrl?: string,
  videoRef?: React.RefObject<HTMLVideoElement>,
  containerRef?: React.RefObject<HTMLDivElement>
) => {
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

  const initAR = useCallback(async () => {
    try {
      console.log("Iniciando experiência AR...");
      
      // Verificar suporte
      const isSupported = await checkXRSupport();
      if (!isSupported) {
        throw new Error("AR não suportado neste dispositivo");
      }

      if (!containerRef?.current || !videoRef?.current) {
        throw new Error("Referências não encontradas");
      }

      // Setup Three.js
      const renderer = setupARCanvas(containerRef.current);
      const scene = createARScene();
      const camera = setupARCamera();
      
      // Iniciar sessão AR
      const session = await initARSession(containerRef.current);
      
      // Setup tracking de imagem
      if (stampImageUrl) {
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
          camera,
          videoPlane: plane
        });
      }

      // Listener para redimensionamento
      const handleResizeEvent = () => handleResize(camera, renderer);
      window.addEventListener("resize", handleResizeEvent);

      console.log("Experiência AR iniciada com sucesso");
      
      return () => {
        window.removeEventListener("resize", handleResizeEvent);
        if (session) session.end().catch(console.error);
        if (renderer) renderer.dispose();
      };
    } catch (error) {
      console.error("Erro ao iniciar AR:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao iniciar experiência AR");
      setTracking({ isTracking: false, confidence: 0 });
    }
  }, [stampImageUrl, videoRef, containerRef]);

  useEffect(() => {
    const cleanup = initAR();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [initAR]);

  return { sceneState, tracking, setTracking };
};