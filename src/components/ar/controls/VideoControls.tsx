import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { ARVideoState } from "@/types/ar";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface VideoControlsProps {
  videoState: ARVideoState;
  onPlayPause: () => void;
  onVolumeChange?: (value: number) => void;
  onSeek?: (value: number) => void;
}

export const VideoControls = ({ 
  videoState, 
  onPlayPause,
  onVolumeChange,
  onSeek
}: VideoControlsProps) => {
  const isMobile = useIsMobile();
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2 md:space-y-4"
    >
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "icon"}
          onClick={onPlayPause}
          className="bg-white/10"
        >
          {videoState.isPlaying ? 
            <Pause className="h-3 w-3 md:h-4 md:w-4" /> : 
            <Play className="h-3 w-3 md:h-4 md:w-4" />
          }
        </Button>
        
        <div className="flex-1 space-y-1">
          <Slider
            value={[videoState.currentTime]}
            max={videoState.duration}
            step={0.1}
            onValueChange={onSeek ? (value) => onSeek(value[0]) : undefined}
            className="flex-1"
          />
          
          <div className="flex justify-between text-[10px] md:text-xs text-white/70">
            <span>{formatTime(videoState.currentTime)}</span>
            <span>{formatTime(videoState.duration)}</span>
          </div>
        </div>
        
        {onVolumeChange && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              onClick={() => onVolumeChange(videoState.volume === 0 ? 1 : 0)}
              className="bg-white/10"
            >
              {videoState.volume === 0 ? 
                <VolumeX className="h-3 w-3 md:h-4 md:w-4" /> : 
                <Volume2 className="h-3 w-3 md:h-4 md:w-4" />
              }
            </Button>
            
            {!isMobile && (
              <Slider
                value={[videoState.volume || 0]}
                max={1}
                step={0.1}
                onValueChange={(value) => onVolumeChange(value[0])}
                className="w-20"
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};