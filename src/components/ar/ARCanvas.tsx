import { useRef } from "react";
import { ARViewSettings } from "@/types/ar";

interface ARCanvasProps {
  settings: ARViewSettings;
}

export const ARCanvas = ({ settings }: ARCanvasProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative min-h-screen" style={{
      backgroundColor: settings.background_color
    }}>
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        webkit-playsinline="true"
      />
      <canvas id="ar-canvas" className="w-full h-full absolute inset-0" />
      
      {settings.landing_page_logo_url && (
        <div className="absolute top-4 left-4 right-4">
          <img 
            src={settings.landing_page_logo_url} 
            alt="Logo"
            className="h-12 object-contain"
          />
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 p-4 rounded-lg backdrop-blur-sm" style={{
          color: settings.landing_page_primary_color
        }}>
          <p className="text-sm">
            {settings.landing_page_description}
          </p>
        </div>
      </div>
    </div>
  );
};