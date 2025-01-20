import { ARSessionConfig, ImageTrackingResult } from "@/types/ar";

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

export const setupARCanvas = (canvas: HTMLCanvasElement): WebGLRenderingContext | null => {
  try {
    const gl = canvas.getContext("webgl", {
      xrCompatible: true,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });

    if (!gl) {
      throw new Error("WebGL não está disponível");
    }

    // Configuração básica do WebGL
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    console.log("Canvas AR configurado com sucesso");
    return gl;
  } catch (error) {
    console.error("Erro ao configurar canvas AR:", error);
    return null;
  }
};

export const initARSession = async (): Promise<XRSession> => {
  try {
    console.log("Iniciando sessão AR...");
    
    const session = await navigator.xr?.requestSession("immersive-ar", {
      requiredFeatures: ["dom-overlay"],
      optionalFeatures: ["image-tracking"],
      domOverlay: { root: document.getElementById("ar-overlay") }
    });

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

export const setupImageTracking = async (session: XRSession, imageUrl: string): Promise<ImageTrackingResult> => {
  try {
    // Verificar se o navegador suporta tracking de imagens
    if (!session.enabledFeatures?.includes("image-tracking")) {
      console.warn("Tracking de imagens não suportado nesta sessão");
      return {
        success: false,
        error: "Tracking de imagens não suportado"
      };
    }

    // Carregar imagem da estampa
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);

    console.log("Imagem carregada para tracking:", imageUrl);
    
    // Retornar resultado do setup
    return {
      success: true
    };
  } catch (error) {
    console.error("Erro ao configurar tracking de imagem:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido"
    };
  }
};

// Função auxiliar para criar uma matriz de transformação 4x4
export const createTransformMatrix = (position: { x: number; y: number; z: number }, rotation: number): Float32Array => {
  const matrix = new Float32Array(16);
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  // Matriz de rotação em Y
  matrix[0] = cos;
  matrix[2] = sin;
  matrix[5] = 1;
  matrix[8] = -sin;
  matrix[10] = cos;

  // Translação
  matrix[12] = position.x;
  matrix[13] = position.y;
  matrix[14] = position.z;
  matrix[15] = 1;

  return matrix;
};