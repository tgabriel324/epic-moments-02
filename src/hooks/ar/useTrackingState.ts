import { useState, useCallback } from "react";
import { ARTrackingState } from "@/types/ar";
import { toast } from "sonner";

export const useTrackingState = () => {
  const [tracking, setTracking] = useState<ARTrackingState>({
    isTracking: false,
    confidence: 0,
    status: 'searching'
  });

  const updateTracking = useCallback((confidence: number, error?: string) => {
    const now = Date.now();
    
    if (confidence < 0.5) {
      setTracking(prevState => ({
        ...prevState,
        status: 'error',
        error: "Dificuldade em detectar a estampa",
        confidence: confidence,
        suggestions: [
          "Verifique a iluminação",
          "Ajuste a distância",
          "Limpe a câmera"
        ],
        attempts: (prevState.attempts || 0) + 1
      }));
      
      if (tracking.attempts && tracking.attempts >= 10) {
        toast.error("Dificuldade em detectar a estampa. Tente ajustar a iluminação ou distância.");
      }
    } else {
      if (confidence > 0.8) {
        toast.success("Estampa detectada com sucesso!");
      }

      setTracking(prevState => ({
        ...prevState,
        isTracking: confidence > 0.7,
        confidence,
        lastUpdate: now,
        status: confidence > 0.7 ? 'tracking' : confidence > 0.5 ? 'adjusting' : 'searching',
        error: undefined
      }));
    }
  }, [tracking.attempts]);

  return { tracking, updateTracking };
};