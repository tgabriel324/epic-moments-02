import { ARTrackingState } from "@/types/ar";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface TrackingFeedbackProps {
  tracking: ARTrackingState;
}

export const TrackingFeedback = ({ tracking }: TrackingFeedbackProps) => {
  // Se estiver tracking com alta confiança, não mostra feedback
  if (tracking.isTracking && tracking.confidence > 0.8) return null;
  
  // Define o status e mensagem baseado no estado do tracking
  const getStatus = () => {
    if (tracking.isTracking) {
      if (tracking.confidence > 0.7) return {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        message: "Estampa detectada!",
        description: "Mantenha a câmera estável",
        color: "bg-green-500"
      };
      return {
        icon: <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />,
        message: "Melhorando tracking...",
        description: "Ajuste a distância e iluminação",
        color: "bg-yellow-500"
      };
    }
    return {
      icon: <AlertCircle className="w-5 h-5 text-cyan-500" />,
      message: "Procurando estampa...",
      description: "Aponte a câmera para a estampa",
      color: "bg-cyan-500"
    };
  };

  const status = getStatus();
  
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-black/70 p-6 rounded-lg backdrop-blur-lg text-white max-w-sm mx-4 shadow-xl"
      >
        <div className="flex items-center space-x-3">
          {status.icon}
          <p className="text-lg font-medium">{status.message}</p>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Confiança</span>
            <span>{Math.round(tracking.confidence * 100)}%</span>
          </div>
          
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${status.color}`}
              initial={{ width: 0 }}
              animate={{ 
                width: `${tracking.confidence * 100}%`,
                transition: { duration: 0.3 }
              }}
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-300"
          >
            {status.description}
          </motion.p>

          {tracking.error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 bg-red-500/20 rounded-md border border-red-500/30"
            >
              <p className="text-sm text-red-300">{tracking.error}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};