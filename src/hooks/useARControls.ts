
import { useState, useEffect, useCallback, useRef } from "react";
import { ARControlsState, ARVideoState } from "@/types/ar";
import { supabase } from "@/integrations/supabase/client";

export const useARControls = (
  videoRef: React.RefObject<HTMLVideoElement>,
  stampId?: string,
  videoId?: string
) => {
  const mounted = useRef(true);
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

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Registrar interação quando o vídeo começa
  useEffect(() => {
    if (!videoState.isPlaying || !stampId || !videoId) return;

    const registerInteraction = async () => {
      try {
        const { error } = await supabase
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
          });

        if (error && mounted.current) {
          console.error("Erro ao registrar interação:", error);
        }
      } catch (err) {
        console.error("Erro ao registrar interação:", err);
      }
    };

    registerInteraction();
  }, [videoState.isPlaying, stampId, videoId]);

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current || !mounted.current) return;
    
    if (videoState.isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setVideoState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  }, [videoState.isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || !mounted.current) return;
    
    setVideoState(prev => ({
      ...prev,
      currentTime: videoRef.current?.currentTime || 0,
      duration: videoRef.current?.duration || 0
    }));
  }, []);

  const handleVolumeChange = useCallback((value: number) => {
    if (!videoRef.current || !mounted.current) return;
    
    videoRef.current.volume = value;
    setVideoState(prev => ({
      ...prev,
      volume: value
    }));
  }, []);

  const handleSeek = useCallback((value: number) => {
    if (!videoRef.current || !mounted.current) return;
    
    videoRef.current.currentTime = value;
    setVideoState(prev => ({
      ...prev,
      currentTime: value
    }));
  }, []);

  const handleScaleChange = useCallback((value: number[]) => {
    if (!mounted.current) return;
    setControlsState(prev => ({
      ...prev,
      scale: value[0]
    }));
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!mounted.current) return;
    setControlsState(prev => ({
      ...prev,
      scale: Math.min(2, prev.scale + 0.1)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!mounted.current) return;
    setControlsState(prev => ({
      ...prev,
      scale: Math.max(0.5, prev.scale - 0.1)
    }));
  }, []);

  const handleRotationReset = useCallback(() => {
    if (!mounted.current) return;
    setControlsState(prev => ({
      ...prev,
      rotation: 0
    }));
  }, []);

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
