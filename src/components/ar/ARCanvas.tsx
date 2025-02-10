
import { useRef, useCallback } from "react";
import { ARViewSettings } from "@/types/ar";
import { AROverlay } from "./overlay/AROverlay";
import { useARScene } from "@/hooks/useARScene";
import { useARControls } from "@/hooks/useARControls";

interface ARCanvasProps {
  settings: ARViewSettings;
  stampImageUrl?: string;
}

export const ARCanvas = ({ settings, stampImageUrl }: ARCanvasProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const { sceneState, tracking } = useARScene({
    stampImageUrl,
    videoRef,
    canvasRef,
    overlayRef
  });
  
  const {
    controlsState,
    videoState,
    handlers
  } = useARControls(videoRef);

  return (
    <div className="relative min-h-screen" style={{
      backgroundColor: settings.background_color
    }}>
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        webkit-playsinline="true"
        onTimeUpdate={handlers.handleTimeUpdate}
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
          scale={controlsState.scale}
          onPlayPause={handlers.handlePlayPause}
          onScaleChange={handlers.handleScaleChange}
          onZoomIn={handlers.handleZoomIn}
          onZoomOut={handlers.handleZoomOut}
          onRotationReset={handlers.handleRotationReset}
        />
      </div>
    </div>
  );
};
