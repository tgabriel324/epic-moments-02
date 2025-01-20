import { ARTrackingState } from "@/types/ar";
import { motion } from "framer-motion";

interface TrackingFeedbackProps {
  tracking: ARTrackingState;
}

export const TrackingFeedback = ({ tracking }: TrackingFeedbackProps) => {
  if (tracking.isTracking) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/50 p-6 rounded-lg backdrop-blur-sm text-white max-w-sm mx-4"
      >
        <div className="flex items-center space-x-3">
          <div className="animate-pulse w-3 h-3 rounded-full bg-cyan-500" />
          <p className="text-lg font-medium">Procurando estampa...</p>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Confiança</span>
            <span>{Math.round(tracking.confidence * 100)}%</span>
          </div>
          
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${tracking.confidence * 100}%`,
                transition: { duration: 0.3 }
              }}
            />
          </div>
          
          <p className="text-sm text-gray-300 mt-2">
            Aponte a câmera para a estampa e mantenha-a estável
          </p>
        </div>
      </motion.div>
    </div>
  );
};