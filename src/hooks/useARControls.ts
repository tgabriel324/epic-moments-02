import { useState, useEffect } from "react";
import { ARControlsState, ARVideoState } from "@/types/ar";
import { supabase } from "@/integrations/supabase/client";

export const useARControls = (
  videoRef: React.RefObject<HTMLVideoElement>,
  stampId?: string,
  videoId?: string
) => {
  const [controlsState, setControlsState] = useState<ARControlsState>({
    scale: 1,
    rotation: 0
  });

  const [videoState, setVideoState] = useState<ARVideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1
  });

  // Registrar interação quando o vídeo começa
  useEffect(() => {
    if (videoState.isPlaying && stampId && videoId) {
      supabase
        .from('ar_interactions')
        .insert({
          stamp_id: stampId,
          video_id: videoId,
          user_agent: navigator.userAgent,
          device_info: JSON.stringify({
            platform: navigator.platform,
            vendor: navigator.vendor,
          }),
          status: 'started'
        })
        .then(({ error }) => {
          if (error) {
            console.error("Erro ao registrar interação:", error);
          }
        });
    }
  }, [videoState.isPlaying, stampId, videoId]);

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
      currentTime: videoRef.current?.currentTime || 0,
      duration: videoRef.current?.duration || 0
    }));
  };

  const handleVolumeChange = (value: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.volume = value;
    setVideoState(prev => ({
      ...prev,
      volume: value
    }));
  };

  const handleSeek = (value: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = value;
    setVideoState(prev => ({
      ...prev,
      currentTime: value
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
      handleVolumeChange,
      handleSeek,
      handleScaleChange,
      handleZoomIn,
      handleZoomOut,
      handleRotationReset
    }
  };
};