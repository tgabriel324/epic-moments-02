
import { useCallback, useRef } from "react";
import * as THREE from "three";
import { KalmanFilter } from "@/utils/ar/kalmanFilter";

export const useVideoPosition = () => {
  const positionFilter = useRef<KalmanFilter>(new KalmanFilter());
  const rotationFilter = useRef<KalmanFilter>(new KalmanFilter());
  const lastPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastRotation = useRef<THREE.Quaternion>(new THREE.Quaternion());

  const updateVideoPosition = useCallback((
    pose: XRPose,
    videoPlane: THREE.Mesh | null,
    onConfidenceUpdate: (confidence: number) => void
  ): number => {
    if (!videoPlane) return 0;

    const { position, orientation } = pose.transform;
    
    // Filtra posição
    const filteredPosition = positionFilter.current.update([
      position.x,
      position.y,
      position.z
    ]);
    
    // Filtra rotação
    const filteredRotation = rotationFilter.current.update([
      orientation.x,
      orientation.y,
      orientation.z,
      orientation.w
    ]);
    
    // Aplica smoothing com interpolação
    const smoothFactor = 0.15;
    const targetPosition = new THREE.Vector3(
      filteredPosition[0],
      filteredPosition[1],
      filteredPosition[2]
    );
    
    const targetRotation = new THREE.Quaternion(
      filteredRotation[0],
      filteredRotation[1],
      filteredRotation[2],
      filteredRotation[3]
    );
    
    // Interpola posição
    lastPosition.current.lerp(targetPosition, smoothFactor);
    videoPlane.position.copy(lastPosition.current);
    
    // Interpola rotação
    lastRotation.current.slerp(targetRotation, smoothFactor);
    videoPlane.quaternion.copy(lastRotation.current);
    
    // Atualiza matriz
    videoPlane.updateMatrix();
    
    // Calcula confiança baseada na estabilidade
    const positionStability = 1 - Math.min(
      lastPosition.current.distanceTo(targetPosition) / 0.1,
      1
    );
    
    const rotationStability = 1 - Math.min(
      lastRotation.current.angleTo(targetRotation) / Math.PI,
      1
    );
    
    const confidence = (positionStability + rotationStability) / 2;
    return confidence;
  }, []);

  return { updateVideoPosition };
};
