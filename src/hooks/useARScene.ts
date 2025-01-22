import { useState, useEffect, useCallback, useRef } from "react";
import * as THREE from "three";
import { ARSceneState, ARTrackingState } from "@/types/ar";
import {
  checkXRSupport,
  setupARCanvas,
  createARScene,
  setupARCamera,
  initARSession,
  setupImageTracking,
  handleResize,
  createVideoMaterial
} from "@/utils/webxr";
import { toast } from "sonner";
import { KalmanFilter } from "@/utils/ar/kalmanFilter";

interface UseARSceneConfig {
  stampImageUrl?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
}

export const useARScene = ({
  stampImageUrl,
  videoRef,
  canvasRef,
  overlayRef
}: UseARSceneConfig) => {
  const [sceneState, setSceneState] = useState<ARSceneState>({
    xrSession: null,
    renderer: null,
    scene: null,
    camera: null,
    videoPlane: null
  });

  const [tracking, setTracking] = useState<ARTrackingState>({
    isTracking: false,
    confidence: 0,
    status: 'searching',
    attempts: 0
  });

  // Refs para performance e tracking
  const frameId = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const trackingAttempts = useRef<number>(0);
  const lastTrackingSuccess = useRef<number>(0);
  const positionFilter = useRef<KalmanFilter>(new KalmanFilter());
  const rotationFilter = useRef<KalmanFilter>(new KalmanFilter());

  // Função para atualizar o estado de tracking com fallback
  const updateTracking = useCallback((confidence: number, error?: string) => {
    const now = Date.now();
    const timeSinceLastSuccess = now - lastTrackingSuccess.current;
    
    console.log(`Tracking update - Confidence: ${confidence}, Time since last success: ${timeSinceLastSuccess}ms`);
    
    // Se não detectou por muito tempo, incrementa tentativas
    if (confidence < 0.5) {
      trackingAttempts.current++;
      
      // Após 5 tentativas sem sucesso, sugere ajustes
      if (trackingAttempts.current > 5) {
        setTracking(prev => ({
          ...prev,
          status: 'error',
          error: "Dificuldade em detectar a estampa",
          confidence: confidence,
          attempts: trackingAttempts.current,
          suggestions: [
            "Verifique a iluminação",
            "Ajuste a distância",
            "Limpe a câmera"
          ]
        }));
        
        // Notifica o usuário após muitas tentativas
        if (trackingAttempts.current === 10) {
          toast.error("Dificuldade em detectar a estampa. Tente ajustar a iluminação ou distância.");
        }
      }
    } else {
      // Reset tentativas quando há sucesso
      trackingAttempts.current = 0;
      lastTrackingSuccess.current = now;
      
      if (confidence > 0.8) {
        toast.success("Estampa detectada com sucesso!");
      }
    }

    // Atualiza estado do tracking
    setTracking(prev => ({
      ...prev,
      isTracking: confidence > 0.7,
      confidence,
      lastUpdate: now,
      status: confidence > 0.7 ? 'tracking' : confidence > 0.5 ? 'adjusting' : 'searching',
      error: error || (confidence < 0.3 ? "Estampa não encontrada" : undefined),
      attempts: trackingAttempts.current
    }));

  }, []);

  // Função para atualizar a posição do vídeo com smoothing
  const updateVideoPosition = useCallback((pose: XRPose) => {
    if (!sceneState.videoPlane) return;

    const { position, orientation } = pose.transform;
    
    // Aplica Kalman filter para suavizar posição
    const filteredPosition = positionFilter.current.update([
      position.x,
      position.y,
      position.z
    ]);
    
    // Aplica Kalman filter para suavizar rotação
    const filteredRotation = rotationFilter.current.update([
      orientation.x,
      orientation.y,
      orientation.z,
      orientation.w
    ]);
    
    // Aplica smoothing na posição
    const smoothFactor = 0.15; // Ajustado para movimento mais suave
    const currentPos = sceneState.videoPlane.position;
    
    currentPos.x += (filteredPosition[0] - currentPos.x) * smoothFactor;
    currentPos.y += (filteredPosition[1] - currentPos.y) * smoothFactor;
    currentPos.z += (filteredPosition[2] - currentPos.z) * smoothFactor;
    
    // Aplica orientação suavizada
    sceneState.videoPlane.quaternion.set(
      filteredRotation[0],
      filteredRotation[1],
      filteredRotation[2],
      filteredRotation[3]
    );

    sceneState.videoPlane.updateMatrix();
    
    // Calcula confiança baseada na estabilidade
    const positionStability = 1 - Math.abs(currentPos.distanceTo(new THREE.Vector3(
      filteredPosition[0],
      filteredPosition[1],
      filteredPosition[2]
    ))) / 0.1; // 0.1 é a distância máxima considerada

    const confidence = Math.min(positionStability, 1);
    updateTracking(confidence);
    
  }, [sceneState.videoPlane, updateTracking]);

  // Inicialização do AR
  useEffect(() => {
    console.log("Iniciando setup da cena AR...");
    
    const initAR = async () => {
      try {
        if (!stampImageUrl || !videoRef.current || !canvasRef.current || !overlayRef.current) {
          throw new Error("Referências necessárias não encontradas");
        }

        // Setup Three.js
        const renderer = setupARCanvas(canvasRef.current);
        const scene = createARScene();
        const camera = setupARCamera();
        
        // Iniciar sessão AR
        const session = await initARSession(overlayRef.current);
        
        // Setup tracking de imagem
        console.log("Configurando tracking de imagem:", stampImageUrl);
        const trackingResult = await setupImageTracking(stampImageUrl);
        
        if (!trackingResult.success) {
          throw new Error(trackingResult.error);
        }

        // Criar plano para o vídeo
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = createVideoMaterial(videoRef.current);
        const plane = new THREE.Mesh(geometry, material);
        plane.matrixAutoUpdate = false;
        scene.add(plane);

        setSceneState({
          xrSession: session,
          renderer,
          scene,
          camera,
          videoPlane: plane
        });

        console.log("Setup AR concluído com sucesso");
        toast.success("Experiência AR iniciada");
        
        // Listener para redimensionamento
        const handleResizeEvent = () => handleResize(camera, renderer);
        window.addEventListener("resize", handleResizeEvent);

        return () => {
          window.removeEventListener("resize", handleResizeEvent);
          if (session) session.end().catch(console.error);
          if (renderer) renderer.dispose();
          if (frameId.current) cancelAnimationFrame(frameId.current);
        };
      } catch (error) {
        console.error("Erro ao iniciar AR:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro ao iniciar experiência AR";
        toast.error(errorMessage);
        setTracking({ 
          isTracking: false, 
          confidence: 0,
          status: 'error',
          error: errorMessage
        });
      }
    };

    initAR();
  }, [stampImageUrl, videoRef, canvasRef, overlayRef]);

  return { 
    sceneState, 
    tracking,
    updateTracking,
    updateVideoPosition
  };
};