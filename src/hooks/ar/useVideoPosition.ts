import { useCallback, useRef } from "react";
import * as THREE from "three";
import { KalmanFilter } from "@/utils/ar/kalmanFilter";

export const useVideoPosition = () => {
  const positionFilter = useRef<KalmanFilter>(new KalmanFilter());
  const rotationFilter = useRef<KalmanFilter>(new KalmanFilter());

  const updateVideoPosition = useCallback((
    pose: XRPose,
    videoPlane: THREE.Mesh | null,
    onConfidenceUpdate: (confidence: number) => void
  ) => {
    if (!videoPlane) return;

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
    const smoothFactor = 0.15;
    const currentPos = videoPlane.position;
    
    currentPos.x += (filteredPosition[0] - currentPos.x) * smoothFactor;
    currentPos.y += (filteredPosition[1] - currentPos.y) * smoothFactor;
    currentPos.z += (filteredPosition[2] - currentPos.z) * smoothFactor;
    
    videoPlane.quaternion.set(
      filteredRotation[0],
      filteredRotation[1],
      filteredRotation[2],
      filteredRotation[3]
    );

    videoPlane.updateMatrix();
    
    // Calcula confiança baseada na estabilidade
    const positionStability = 1 - Math.abs(currentPos.distanceTo(new THREE.Vector3(
      filteredPosition[0],
      filteredPosition[1],
      filteredPosition[2]
    ))) / 0.1;

    onConfidenceUpdate(Math.min(positionStability, 1));
  }, []);

  return { updateVideoPosition };
};