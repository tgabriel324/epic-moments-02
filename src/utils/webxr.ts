import * as THREE from "three";
import { ARSessionConfig, ImageTrackingResult } from "@/types/ar";
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

export const setupARCanvas = (container: HTMLElement): THREE.WebGLRenderer => {
  console.log("Configurando canvas AR...");
  
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  
  container.appendChild(renderer.domElement);
  
  console.log("Canvas AR configurado com sucesso");
  return renderer;
};

export const createARScene = (): THREE.Scene => {
  console.log("Criando cena AR...");
  
  const scene = new THREE.Scene();
  
  // Luz ambiente
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  // Luz direcional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 5, 0);
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
    // Carregar imagem
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    
    // Criar array para pontos característicos
    const featurePoints = new Float32Array(100 * 2); // 100 pontos x,y
    
    // Simular extração de pontos característicos
    for (let i = 0; i < 100; i++) {
      featurePoints[i * 2] = Math.random() * imageBitmap.width;
      featurePoints[i * 2 + 1] = Math.random() * imageBitmap.height;
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

// Função auxiliar para redimensionar
export const handleResize = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): void => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};