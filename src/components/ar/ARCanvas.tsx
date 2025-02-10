
import { useRef, useEffect } from "react";
import { ARViewSettings } from "@/types/ar";
import { AROverlay } from "./overlay/AROverlay";
import { useARInit } from "@/hooks/ar/useARInit";
import { LoadingScreen } from "./LoadingScreen";
import { ErrorScreen } from "./ErrorScreen";

interface ARCanvasProps {
  settings: ARViewSettings;
  stampImageUrl?: string;
}

export const ARCanvas = ({ settings, stampImageUrl }: ARCanvasProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const { sceneState, error, usingFallback } = useARInit({
    stampImageUrl,
    videoRef,
    canvasRef,
    overlayRef
  });

  if (error) {
    return <ErrorScreen settings={settings} error={error} />;
  }

  return (
    <div className="relative min-h-screen" style={{
      backgroundColor: settings.background_color
    }}>
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${usingFallback ? 'block' : 'hidden'}`}
        playsInline
        autoPlay
        muted
        webkit-playsinline="true"
      />
      
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0"
      />
      
      <div ref={overlayRef}>
        <AROverlay 
          settings={settings}
          tracking={{
            isTracking: false,
            confidence: 0,
            status: usingFallback ? 'fallback' : 'searching'
          }}
          videoState={{
            isPlaying: true,
            currentTime: 0,
            duration: 0
          }}
          scale={1}
          onPlayPause={() => {}}
          onScaleChange={() => {}}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onRotationReset={() => {}}
        />
      </div>
    </div>
  );
};

