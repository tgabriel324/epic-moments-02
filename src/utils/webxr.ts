import * as THREE from "three";
import { ImageTrackingResult } from "@/types/ar";
import { toast } from "sonner";

export const checkXRSupport = async (): Promise<boolean> => {
  console.log("Verificando suporte WebXR...");
  
  if (!window.navigator.xr) {
    console.error("WebXR não disponível neste navegador");
    return false;
  }

  try {
    const supported = await navigator.xr.isSessionSupported("immersive-ar");
    console.log("Suporte WebXR:", supported ? "Disponível" : "Indisponível");
    return supported;
  } catch (error) {
    console.error("Erro ao verificar suporte WebXR:", error);
    return false;
  }
};

export const setupARCanvas = (container: HTMLCanvasElement): THREE.WebGLRenderer => {
  console.log("Configurando canvas AR...");
  
  const renderer = new THREE.WebGLRenderer({
    canvas: container,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  
  console.log("Canvas AR configurado com sucesso");
  return renderer;
};

export const createARScene = (): THREE.Scene => {
  console.log("Criando cena AR...");
  
  const scene = new THREE.Scene();
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 5, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);
  
  console.log("Cena AR criada com sucesso");
  return scene;
};

export const setupARCamera = (): THREE.PerspectiveCamera => {
  console.log("Configurando câmera AR...");
  
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  camera.position.z = 5;
  
  console.log("Câmera AR configurada com sucesso");
  return camera;
};

export const initARSession = async (domOverlay: Element): Promise<XRSession> => {
  console.log("Iniciando sessão AR...");
  
  try {
    if (!navigator.xr) {
      throw new Error("WebXR não disponível");
    }

    const sessionInit: XRSessionInit = {
      requiredFeatures: ["hit-test", "dom-overlay"],
      domOverlay: { root: domOverlay },
      optionalFeatures: ["image-tracking", "camera-access"]
    };

    const session = await navigator.xr.requestSession("immersive-ar", sessionInit);
    console.log("Sessão AR iniciada com sucesso");
    return session;
  } catch (error) {
    console.error("Erro ao iniciar sessão AR:", error);
    throw error;
  }
};

export const setupImageTracking = async (imageUrl: string): Promise<ImageTrackingResult> => {
  console.log("Configurando tracking de imagem:", imageUrl);
  
  try {
    // Carregar e processar imagem
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    
    // Criar array para pontos característicos
    const featurePoints = new Float32Array(100 * 2); // 100 pontos x,y
    
    // Extrair características da imagem usando canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Contexto 2D não disponível");
    
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    ctx.drawImage(imageBitmap, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Algoritmo simples de detecção de bordas para pontos característicos
    let pointIndex = 0;
    const step = Math.floor(data.length / 400); // Reduzir amostragem para performance
    
    for (let i = 0; i < data.length; i += step) {
      if (pointIndex >= 100) break;
      
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detectar mudanças significativas de intensidade
      const intensity = (r + g + b) / 3;
      if (intensity > 200 || intensity < 50) {
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);
        
        featurePoints[pointIndex * 2] = x;
        featurePoints[pointIndex * 2 + 1] = y;
        pointIndex++;
      }
    }
    
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

export const createVideoMaterial = (video: HTMLVideoElement): THREE.Material => {
  console.log("Criando material de vídeo...");
  
  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;
  texture.colorSpace = THREE.SRGBColorSpace;
  
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true
  });
  
  console.log("Material de vídeo criado com sucesso");
  return material;
};

export const updateVideoPlane = (
  plane: THREE.Mesh,
  scale: number,
  rotation: number
): void => {
  if (!plane) return;
  
  plane.scale.set(scale, scale, 1);
  plane.rotation.y = rotation;
};

export const handleResize = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): void => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
