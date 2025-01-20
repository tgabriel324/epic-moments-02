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
    
    const session = await navigator.xr.requestSession("immersive-ar", {
      requiredFeatures: ["dom-overlay", "hit-test"],
      optionalFeatures: ["image-tracking"],
      domOverlay: { root: document.getElementById("ar-overlay") }
    });

    console.log("Sessão AR iniciada com sucesso");
    return session;
  } catch (error) {
    console.error("Erro ao iniciar sessão AR:", error);
    throw error;
  }
};

export const setupImageTracking = async (session: XRSession, imageUrl: string): Promise<XRTrackedImage | null> => {
  try {
    // Verificar se o navegador suporta tracking de imagens
    if (!session.enabledFeatures?.includes("image-tracking")) {
      console.warn("Tracking de imagens não suportado nesta sessão");
      return null;
    }

    // Carregar imagem da estampa
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);

    console.log("Imagem carregada para tracking:", imageUrl);
    
    // Retornar objeto de tracking
    return {
      trackingState: "limited",
      imageSpace: session.requestReferenceSpace("viewer")
    };
  } catch (error) {
    console.error("Erro ao configurar tracking de imagem:", error);
    return null;
  }
};