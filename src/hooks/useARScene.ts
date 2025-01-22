import { useRef } from "react";
import { useTrackingState } from "./ar/useTrackingState";
import { useVideoPosition } from "./ar/useVideoPosition";
import { useARInit } from "./ar/useARInit";

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
  
  const { tracking, updateTracking } = useTrackingState();
  const { updateVideoPosition } = useVideoPosition();
  const { sceneState } = useARInit(stampImageUrl, videoRef, canvasRef, overlayRef);

  // Função principal de renderização e tracking
  const onFrame = (frame: XRFrame) => {
    if (!sceneState.renderer || !sceneState.scene || !sceneState.camera) return;

    const pose = frame.getViewerPose(referenceSpace);
    if (pose) {
      updateVideoPosition(pose, sceneState.videoPlane, updateTracking);
      sceneState.renderer.render(sceneState.scene, sceneState.camera);
    }

    frameId.current = frame.session.requestAnimationFrame(onFrame);
  };

  return { 
    sceneState, 
    tracking,
    updateTracking,
    onFrame
  };
};