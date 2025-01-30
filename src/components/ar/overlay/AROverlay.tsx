import { ARViewSettings, ARTrackingState, ARVideoState } from "@/types/ar";
import { VideoControls } from "../controls/VideoControls";
import { TransformControls } from "../controls/TransformControls";
import { TrackingFeedback } from "../tracking/TrackingFeedback";
import { useIsMobile } from "@/hooks/use-mobile";

interface AROverlayProps {
  settings: ARViewSettings;
  tracking: ARTrackingState;
  videoState: ARVideoState;
  scale: number;
  onPlayPause: () => void;
  onScaleChange: (value: number[]) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotationReset: () => void;
}

export const AROverlay = ({
  settings,
  tracking,
  videoState,
  scale,
  onPlayPause,
  onScaleChange,
  onZoomIn,
  onZoomOut,
  onRotationReset
}: AROverlayProps) => {
  const isMobile = useIsMobile();

  return (
    <div id="ar-overlay" className="absolute inset-0 pointer-events-none">
      {/* Logo */}
      {settings.landing_page_logo_url && (
        <div className="absolute top-safe-4 left-4 right-4">
          <img 
            src={settings.landing_page_logo_url} 
            alt="Logo"
            className="h-8 md:h-12 object-contain"
          />
        </div>
      )}
      
      {/* Tracking Feedback */}
      <TrackingFeedback tracking={tracking} />
      
      {/* Controls */}
      <div className={`absolute ${isMobile ? 'bottom-16' : 'bottom-24'} left-2 right-2 md:left-4 md:right-4 pointer-events-auto`}>
        <div className="bg-black/50 p-3 md:p-4 rounded-lg backdrop-blur-sm space-y-3 md:space-y-4">
          <VideoControls 
            videoState={videoState}
            onPlayPause={onPlayPause}
          />
          
          <TransformControls 
            scale={scale}
            onScaleChange={onScaleChange}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onRotationReset={onRotationReset}
          />
        </div>
      </div>
      
      {/* Description */}
      <div className="absolute bottom-2 md:bottom-4 left-2 right-2 md:left-4 md:right-4">
        <div 
          className="bg-black/50 p-3 md:p-4 rounded-lg backdrop-blur-sm"
          style={{ color: settings.landing_page_primary_color }}
        >
          <p className="text-xs md:text-sm text-center">
            {settings.landing_page_description}
          </p>
        </div>
      </div>
    </div>
  );
};