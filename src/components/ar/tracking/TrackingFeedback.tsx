import { ARTrackingState } from "@/types/ar";

interface TrackingFeedbackProps {
  tracking: ARTrackingState;
}

export const TrackingFeedback = ({ tracking }: TrackingFeedbackProps) => {
  if (tracking.isTracking) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black/50 p-4 rounded-lg backdrop-blur-sm text-white">
        <p>Procurando superfície...</p>
        <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${tracking.confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};