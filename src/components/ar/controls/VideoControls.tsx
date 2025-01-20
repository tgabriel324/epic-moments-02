import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import { ARVideoState } from "@/types/ar";

interface VideoControlsProps {
  videoState: ARVideoState;
  onPlayPause: () => void;
}

export const VideoControls = ({ videoState, onPlayPause }: VideoControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
        className="bg-white/10"
      >
        {videoState.isPlaying ? 
          <Pause className="h-4 w-4" /> : 
          <Play className="h-4 w-4" />
        }
      </Button>
      
      <Slider
        value={[videoState.currentTime]}
        max={videoState.duration}
        step={0.1}
        className="flex-1"
      />
    </div>
  );
};