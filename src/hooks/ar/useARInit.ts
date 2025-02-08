
import { useState, useEffect } from "react";
import * as THREE from "three";
import { ARSceneState } from "@/types/ar";
import {
  checkXRSupport,
  setupARCanvas,
  createARScene,
  setupARCamera,
  initARSession,
  setupImageTracking,
  createVideoMaterial
} from "@/utils/webxr";
import { toast } from "sonner";

export const useARInit = (
  stampImageUrl: string | undefined,
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  overlayRef: React.RefObject<HTMLDivElement>
) => {
  const [sceneState, setSceneState] = useState<ARSceneState>({
    xrSession: null,
    renderer: null,
    scene: null,
    camera: null,
    videoPlane: null
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Iniciando setup da cena AR...");
    
    const initAR = async () => {
      try {
        if (!stampImageUrl || !videoRef.current || !canvasRef.current || !overlayRef.current) {
          throw new Error("Referências necessárias não encontradas");
        }

        const renderer = setupARCanvas(canvasRef.current);
        const scene = createARScene();
        const camera = setupARCamera();
        const session = await initARSession(overlayRef.current);
        
        console.log("Configurando tracking de imagem:", stampImageUrl);
        const trackingResult = await setupImageTracking(stampImageUrl);
        
        if (!trackingResult.success) {
          throw new Error(trackingResult.error);
        }

        const geometry = new THREE.PlaneGeometry(1, 1);
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
        setError(null);

        console.log("Setup AR concluído com sucesso");
        toast.success("Experiência AR iniciada");

        const handleResizeEvent = () => {
          if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          }
        };
        
        window.addEventListener("resize", handleResizeEvent);

        return () => {
          window.removeEventListener("resize", handleResizeEvent);
          if (session) session.end().catch(console.error);
          if (renderer) renderer.dispose();
        };
      } catch (error) {
        console.error("Erro ao iniciar AR:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro ao iniciar experiência AR";
        setError(errorMessage);
        toast.error(errorMessage);
        throw error;
      }
    };

    initAR();
  }, [stampImageUrl, videoRef, canvasRef, overlayRef]);

  return { sceneState, error };
};
