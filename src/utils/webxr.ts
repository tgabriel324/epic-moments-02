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

    // Verificar suporte específico para tracking de imagens
    const imageTrackingSupported = await navigator.xr.isSessionSupported("immersive-ar-image-tracking");
    if (!imageTrackingSupported) {
      console.error("Tracking de imagens não é suportado neste dispositivo");
      return false;
    }

    console.log("WebXR e tracking de imagens suportados!");
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
    
    const session = await navigator.xr.requestSession("immersive-ar", {
      requiredFeatures: ["image-tracking"],
      imageTrackingOptions: {
        trackingMode: "best-quality"
      }
    });

    console.log("Sessão AR iniciada com sucesso");
    return session;
  } catch (error) {
    console.error("Erro ao iniciar sessão AR:", error);
    throw error;
  }
};

export const createImageTracker = async (session: XRSession, imageUrl: string): Promise<XRImageTracker> => {
  try {
    // Carregar imagem da estampa
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);

    // Criar tracker de imagem
    const tracker = await session.createImageTracker([{
      image: imageBitmap,
      widthInMeters: 0.2 // Ajuste conforme o tamanho real da estampa
    }]);

    console.log("Tracker de imagem criado com sucesso");
    return tracker;
  } catch (error) {
    console.error("Erro ao criar tracker de imagem:", error);
    throw error;
  }
};