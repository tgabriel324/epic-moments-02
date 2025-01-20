import { ARSessionConfig, ImageTrackingResult } from "@/types/ar";
import * as THREE from "three";

export const checkXRSupport = async (): Promise<boolean> => {
  if (!window.navigator.xr) {
    console.error("WebXR não está disponível neste navegador");
    return false;
  }

  try {
    const supported = await navigator.xr.isSessionSupported("immersive-ar");
    if (!supported) {
      console.error("AR não é suportado neste dispositivo");
      return false;
    }

    console.log("WebXR suportado!");
    return true;
  } catch (error) {
    console.error("Erro ao verificar suporte WebXR:", error);
    return false;
  }
};

export const setupARCanvas = (canvas: HTMLCanvasElement): THREE.WebGLRenderer => {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    console.log("Canvas AR configurado com sucesso");
    return renderer;
  } catch (error) {
    console.error("Erro ao configurar canvas AR:", error);
    throw error;
  }
};

export const initARSession = async (domOverlay: Element): Promise<XRSession> => {
  try {
    console.log("Iniciando sessão AR...");
    
    const sessionInit: XRSessionInit = {
      requiredFeatures: ["dom-overlay", "image-tracking"],
      domOverlay: { root: domOverlay }
    };

    const session = await navigator.xr?.requestSession("immersive-ar", sessionInit);

    if (!session) {
      throw new Error("Não foi possível iniciar a sessão AR");
    }

    console.log("Sessão AR iniciada com sucesso");
    return session;
  } catch (error) {
    console.error("Erro ao iniciar sessão AR:", error);
    throw error;
  }
};

export const setupImageTracking = async (imageUrl: string): Promise<ImageTrackingResult> => {
  try {
    // Carregar imagem da estampa
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);

    // Extrair características da imagem para tracking
    const trackingData = {
      imageWidth: imageBitmap.width,
      imageHeight: imageBitmap.height,
      featurePoints: await extractFeaturePoints(imageBitmap)
    };

    console.log("Imagem carregada para tracking:", imageUrl);
    
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

const extractFeaturePoints = async (image: ImageBitmap): Promise<number[]> => {
  // Simulação de extração de pontos característicos
  // Em uma implementação real, usaríamos uma biblioteca de visão computacional
  const points: number[] = [];
  const numPoints = 100;
  
  for (let i = 0; i < numPoints; i++) {
    points.push(
      Math.random() * image.width,
      Math.random() * image.height
    );
  }
  
  return points;
};

export const createVideoMaterial = (video: HTMLVideoElement): THREE.Material => {
  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;

  return new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true
  });
};

export const createARScene = (): THREE.Scene => {
  const scene = new THREE.Scene();
  
  // Luz ambiente
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Luz direcional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 5, 0);
  scene.add(directionalLight);

  return scene;
};

export const updateVideoPlane = (
  plane: THREE.Mesh,
  scale: number,
  rotation: number
): void => {
  plane.scale.set(scale, scale, 1);
  plane.rotation.y = rotation;
};