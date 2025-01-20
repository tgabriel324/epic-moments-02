import { ImageTrackingResult } from "@/types/ar";

export const setupImageTracking = async (imageUrl: string): Promise<ImageTrackingResult> => {
  console.log("Configurando tracking de imagem:", imageUrl);
  
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    
    const featurePoints = await extractFeaturePoints(imageBitmap);
    
    console.log("Tracking de imagem configurado com sucesso");
    return {
      success: true,
      trackingData: {
        imageWidth: imageBitmap.width,
        imageHeight: imageBitmap.height,
        featurePoints
      }
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
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Contexto 2D não disponível");
  
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  ctx.drawImage(imageBitmap, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const featurePoints = new Float32Array(100 * 2);
  let pointIndex = 0;
  const step = Math.floor(data.length / 400);
  
  for (let i = 0; i < data.length; i += step) {
    if (pointIndex >= 100) break;
    
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const intensity = (r + g + b) / 3;
    if (intensity > 200 || intensity < 50) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);
      
      featurePoints[pointIndex * 2] = x;
      featurePoints[pointIndex * 2 + 1] = y;
      pointIndex++;
    }
  }
  
  return featurePoints;
};