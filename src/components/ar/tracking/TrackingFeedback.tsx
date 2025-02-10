import { ARTrackingState } from "@/types/ar";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Camera, Lightbulb, Ruler } from "lucide-react";
import { useEffect, useState } from "react";

interface TrackingFeedbackProps {
  tracking: ARTrackingState;
}

export const TrackingFeedback = ({ tracking }: TrackingFeedbackProps) => {
  const [showTutorial, setShowTutorial] = useState(true);
  
  useEffect(() => {
    if (tracking.isTracking && tracking.confidence > 0.8) {
      setShowTutorial(false);
    }
  }, [tracking.isTracking, tracking.confidence]);

  if (tracking.isTracking && tracking.confidence > 0.8 && !showTutorial) return null;
  
  const getStatus = () => {
    if (tracking.status === 'fallback') {
      return {
        icon: <Camera className="w-6 h-6 text-cyan-500" />,
        message: "Modo câmera simples",
        description: "AR não disponível neste dispositivo",
        color: "bg-cyan-500",
        suggestions: [
          {
            icon: <Camera className="w-4 h-4" />,
            text: "Posicione a estampa no centro"
          },
          {
            icon: <Lightbulb className="w-4 h-4" />,
            text: "Mantenha boa iluminação"
          }
        ]
      };
    }

    if (tracking.error) {
      return {
        icon: <AlertCircle className="w-6 h-6 text-red-500" />,
        message: tracking.error,
        description: "Tente novamente ou verifique se a estampa está correta",
        color: "bg-red-500",
        suggestions: [
          {
            icon: <Camera className="w-4 h-4" />,
            text: "Mantenha a câmera estável"
          },
          {
            icon: <Lightbulb className="w-4 h-4" />,
            text: "Busque um ambiente bem iluminado"
          },
          {
            icon: <Ruler className="w-4 h-4" />,
            text: "Ajuste a distância da estampa"
          }
        ]
      };
    }

    if (tracking.isTracking) {
      if (tracking.confidence > 0.7) return {
        icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
        message: "Estampa detectada!",
        description: "Mantenha a câmera estável",
        color: "bg-green-500",
        suggestions: []
      };
      return {
        icon: <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />,
        message: "Melhorando tracking...",
        description: "Ajuste a distância e iluminação",
        color: "bg-yellow-500",
        suggestions: [
          {
            icon: <Camera className="w-4 h-4" />,
            text: "Mantenha a câmera estável"
          },
          {
            icon: <Lightbulb className="w-4 h-4" />,
            text: "Busque melhor iluminação"
          }
        ]
      };
    }

    return {
      icon: <Camera className="w-6 h-6 text-cyan-500" />,
      message: "Procurando estampa...",
      description: "Aponte a câmera para a estampa",
      color: "bg-cyan-500",
      suggestions: [
        {
          icon: <Camera className="w-4 h-4" />,
          text: "Centralize a estampa na tela"
        }
      ]
    };
  };

  const status = getStatus();
  
  return (
    <AnimatePresence>
      <motion.div 
        className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
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

            {status.suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 space-y-2"
              >
                {status.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.1 }
                    }}
                    className="flex items-center space-x-2 text-sm text-gray-300"
                  >
                    {suggestion.icon}
                    <span>{suggestion.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {tracking.attempts && tracking.attempts > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-yellow-500/20 rounded-md border border-yellow-500/30"
              >
                <p className="text-sm text-yellow-300">
                  Várias tentativas detectadas. Tente:
                  <br />
                  1. Verificar a iluminação
                  <br />
                  2. Limpar a câmera
                  <br />
                  3. Ajustar a distância
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
