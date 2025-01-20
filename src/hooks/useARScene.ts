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

  // Refs para performance
  const frameId = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);

  const initAR = useCallback(async () => {
    try {
      console.log("Iniciando experiência AR...");
      
      // Verificar suporte
      const isSupported = await checkXRSupport();
      if (!isSupported) {
        throw new Error("AR não suportado neste dispositivo");
      }

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
        const trackingResult = await setupImageTracking(stampImageUrl);
        if (!trackingResult.success) {
          throw new Error(trackingResult.error);
        }

        // Criar plano para o vídeo com otimizações
        const geometry = new THREE.PlaneGeometry(1, 1);
        geometry.computeBoundingSphere(); // Otimizar culling
        
        const material = createVideoMaterial(videoRef.current);
        const plane = new THREE.Mesh(geometry, material);
        plane.matrixAutoUpdate = false; // Otimizar updates
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

      // Setup animation loop otimizado
      const animate = (time: number) => {
        frameId.current = requestAnimationFrame(animate);
        
        // Calcular FPS
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

      console.log("Experiência AR iniciada com sucesso");
      
      return () => {
        window.removeEventListener("resize", handleResizeEvent);
        if (session) session.end().catch(console.error);
        if (renderer) renderer.dispose();
        if (frameId.current) cancelAnimationFrame(frameId.current);
      };
    } catch (error) {
      console.error("Erro ao iniciar AR:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao iniciar experiência AR");
      setTracking({ isTracking: false, confidence: 0 });
    }
  }, [stampImageUrl, videoRef, canvasRef, overlayRef]);

  useEffect(() => {
    const cleanup = initAR();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [initAR]);

  return { sceneState, tracking, setTracking };
};