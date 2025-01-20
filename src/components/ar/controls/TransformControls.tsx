import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface TransformControlsProps {
  scale: number;
  onScaleChange: (value: number[]) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotationReset: () => void;
}

export const TransformControls = ({
  scale,
  onScaleChange,
  onZoomIn,
  onZoomOut,
  onRotationReset
}: TransformControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="bg-white/10"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Slider
        value={[scale]}
        min={0.5}
        max={2}
        step={0.1}
        onValueChange={onScaleChange}
        className="flex-1"
      />
      
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="bg-white/10"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onRotationReset}
        className="bg-white/10"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};