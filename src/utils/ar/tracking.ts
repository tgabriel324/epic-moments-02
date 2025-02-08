
import { ImageTrackingResult } from "@/types/ar";
import * as THREE from "three";

export const setupImageTracking = async (imageUrl: string): Promise<ImageTrackingResult> => {
  console.log("Configurando tracking de imagem:", imageUrl);
  
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Falha ao carregar imagem de referência");
    }
    
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    
    console.log("Dimensões da imagem:", {
      width: imageBitmap.width,
      height: imageBitmap.height
    });
    
    const featurePoints = await extractFeaturePoints(imageBitmap);
    const trackingData = {
      imageWidth: imageBitmap.width,
      imageHeight: imageBitmap.height,
      featurePoints,
      aspectRatio: imageBitmap.width / imageBitmap.height,
      timestamp: Date.now()
    };
    
    console.log("Tracking configurado com sucesso:", {
      pointsCount: featurePoints.length / 2,
      aspectRatio: trackingData.aspectRatio
    });
    
    return {
      success: true,
      trackingData
    };
  } catch (error) {
    console.error("Erro ao configurar tracking de imagem:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido"
    };
  }
};

const extractFeaturePoints = async (imageBitmap: ImageBitmap): Promise<Float32Array> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error("Contexto 2D não disponível");
  
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  ctx.drawImage(imageBitmap, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Aumenta o número de pontos para melhor tracking
  const maxPoints = 200;
  const featurePoints = new Float32Array(maxPoints * 2);
  let pointIndex = 0;
  
  // Otimiza a detecção de bordas usando Sobel
  const sobelThreshold = 50;
  const width = canvas.width;
  const height = canvas.height;
  
  for (let y = 1; y < height - 1 && pointIndex < maxPoints; y++) {
    for (let x = 1; x < width - 1 && pointIndex < maxPoints; x++) {
      const pos = (y * width + x) * 4;
      
      // Aplica operador Sobel
      const gx = 
        -data[pos - 4] + 
        data[pos + 4] - 
        data[pos - 4 + width * 4] * 2 + 
        data[pos + 4 + width * 4] * 2 - 
        data[pos - 4 - width * 4] + 
        data[pos + 4 - width * 4];
        
      const gy = 
        -data[pos - width * 4] + 
        data[pos + width * 4] - 
        data[pos - 4 - width * 4] * 2 + 
        data[pos - 4 + width * 4] * 2 - 
        data[pos + 4 - width * 4] + 
        data[pos + 4 + width * 4];
      
      const gradientMagnitude = Math.sqrt(gx * gx + gy * gy);
      
      if (gradientMagnitude > sobelThreshold) {
        featurePoints[pointIndex * 2] = x;
        featurePoints[pointIndex * 2 + 1] = y;
        pointIndex++;
        
        // Pula alguns pixels para distribuir melhor os pontos
        x += 3;
      }
    }
  }
  
  console.log(`Detectados ${pointIndex} pontos de interesse`);
  return featurePoints;
};

export const calculateTrackingConfidence = (
  currentPoints: Float32Array,
  referencePoints: Float32Array,
  threshold: number = 0.7
): number => {
  let matchCount = 0;
  const totalPoints = Math.min(currentPoints.length, referencePoints.length) / 2;
  
  for (let i = 0; i < totalPoints * 2; i += 2) {
    const dx = currentPoints[i] - referencePoints[i];
    const dy = currentPoints[i + 1] - referencePoints[i + 1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < threshold) {
      matchCount++;
    }
  }
  
  return matchCount / totalPoints;
};
