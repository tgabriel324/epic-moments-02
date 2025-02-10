
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { ARSceneState } from "@/types/ar";
import { toast } from "sonner";

interface UseARInitProps {
  stampImageUrl: string | undefined;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
}

export const useARInit = ({ stampImageUrl, videoRef, canvasRef, overlayRef }: UseARInitProps) => {
  const [sceneState, setSceneState] = useState<ARSceneState>({
    xrSession: null,
    renderer: null,
    scene: null,
    camera: null,
    videoPlane: null
  });
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const initializingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    console.log("Iniciando setup da cena AR...");
    
    const initAR = async () => {
      if (initializingRef.current) {
        console.log("Inicialização AR já em andamento...");
        return;
      }

      initializingRef.current = true;

      try {
        if (!stampImageUrl || !videoRef.current || !canvasRef.current || !overlayRef.current) {
          throw new Error("Referências necessárias não encontradas");
        }

        // Tentar iniciar modo AR
        try {
          if (navigator.xr) {
            const isArSupported = await navigator.xr.isSessionSupported("immersive-ar");
            if (isArSupported) {
              console.log("AR suportado, iniciando modo AR...");
              // Setup AR aqui
              return;
            }
          }
          console.log("AR não suportado, usando fallback de câmera");
          setUsingFallback(true);
        } catch (e) {
          console.log("Erro ao verificar suporte AR, usando fallback:", e);
          setUsingFallback(true);
        }

        // Modo fallback com câmera simples
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight }
          }
        };

        console.log("Solicitando permissão da câmera com constraints:", constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Metadados do vídeo carregados");
            if (isMounted) {
              setError(null);
              videoRef.current?.play().catch(console.error);
            }
          };
        }

        // Setup da cena THREE.js básica para fallback
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        if (isMounted) {
          setSceneState({
            xrSession: null,
            renderer,
            scene,
            camera,
            videoPlane: null
          });
        }

      } catch (error) {
        console.error("Erro ao iniciar AR:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro ao iniciar experiência AR";
        if (isMounted) {
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        initializingRef.current = false;
      }
    };

    initAR();

    return () => {
      isMounted = false;
      if (sceneState.renderer) {
        sceneState.renderer.dispose();
      }
      // Limpar streams de vídeo
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stampImageUrl, videoRef, canvasRef, overlayRef]);

  return { sceneState, error, usingFallback };
};
