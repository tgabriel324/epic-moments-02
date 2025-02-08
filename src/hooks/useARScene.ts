
import { useRef, useState, useEffect } from "react";
import { useTrackingState } from "./ar/useTrackingState";
import { useVideoPosition } from "./ar/useVideoPosition";
import { useARInit } from "./ar/useARInit";
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
  const frameId = useRef<number>();
  const referenceSpaceRef = useRef<XRReferenceSpace | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const trackingLostCount = useRef<number>(0);
  
  const { tracking, updateTracking } = useTrackingState();
  const { updateVideoPosition } = useVideoPosition();
  const { sceneState, error } = useARInit(stampImageUrl, videoRef, canvasRef, overlayRef);

  useEffect(() => {
    if (error) {
      toast.error("Erro ao inicializar AR: " + error);
    }
  }, [error]);

  // Função de tracking com otimizações
  const onFrame = (time: number, frame: XRFrame) => {
    if (!sceneState.renderer || !sceneState.scene || !sceneState.camera) {
      console.warn("Componentes da cena não inicializados");
      return;
    }

    const pose = frame.getViewerPose(referenceSpaceRef.current!);
    if (pose) {
      const currentTime = performance.now();
      const timeDelta = currentTime - lastUpdateTime.current;
      
      // Atualiza posição e tracking a cada 16ms (aprox. 60fps)
      if (timeDelta >= 16) {
        const confidence = updateVideoPosition(pose, sceneState.videoPlane, updateTracking);
        
        if (confidence < 0.3) {
          trackingLostCount.current++;
          if (trackingLostCount.current > 30) { // ~0.5 segundos
            updateTracking(confidence, "Tracking perdido - Reposicione a câmera");
          }
        } else {
          trackingLostCount.current = 0;
          if (confidence > 0.8) {
            updateTracking(confidence);
          }
        }
        
        lastUpdateTime.current = currentTime;
      }
      
      sceneState.renderer.render(sceneState.scene, sceneState.camera);
    } else {
      console.warn("Pose não encontrada");
    }

    frameId.current = frame.session.requestAnimationFrame(onFrame);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (frameId.current) {
        if (sceneState.xrSession) {
          sceneState.xrSession.cancelAnimationFrame(frameId.current);
        }
        frameId.current = undefined;
      }
    };
  }, [sceneState.xrSession]);

  return { 
    sceneState, 
    tracking,
    updateTracking,
    onFrame
  };
};
