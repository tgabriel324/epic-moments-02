import { useState } from "react";
import { ARControlsState, ARVideoState } from "@/types/ar";

export const useARControls = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [controlsState, setControlsState] = useState<ARControlsState>({
    scale: 1,
    rotation: 0
  });

  const [videoState, setVideoState] = useState<ARVideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (videoState.isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setVideoState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    setVideoState(prev => ({
      ...prev,
      currentTime: videoRef.current?.currentTime || 0
    }));
  };

  const handleScaleChange = (value: number[]) => {
    setControlsState(prev => ({
      ...prev,
      scale: value[0]
    }));
  };

  const handleZoomIn = () => {
    setControlsState(prev => ({
      ...prev,
      scale: Math.min(2, prev.scale + 0.1)
    }));
  };

  const handleZoomOut = () => {
    setControlsState(prev => ({
      ...prev,
      scale: Math.max(0.5, prev.scale - 0.1)
    }));
  };

  const handleRotationReset = () => {
    setControlsState(prev => ({
      ...prev,
      rotation: 0
    }));
  };

  return {
    controlsState,
    videoState,
    handlers: {
      handlePlayPause,
      handleTimeUpdate,
      handleScaleChange,
      handleZoomIn,
      handleZoomOut,
      handleRotationReset
    }
  };
};