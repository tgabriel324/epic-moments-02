import { toast } from "sonner";

export const checkXRSupport = async (): Promise<boolean> => {
  console.log("Verificando suporte WebXR...");
  
  if (!navigator.xr) {
    console.error("WebXR não está disponível neste navegador");
    toast.error("Seu navegador não suporta realidade aumentada");
    return false;
  }

  try {
    const isSupported = await navigator.xr.isSessionSupported("immersive-ar");
    console.log("Suporte WebXR:", isSupported);
    
    if (!isSupported) {
      toast.error("Seu dispositivo não suporta realidade aumentada");
    }
    
    return isSupported;
  } catch (error) {
    console.error("Erro ao verificar suporte WebXR:", error);
    toast.error("Erro ao verificar suporte para realidade aumentada");
    return false;
  }
};

export const initARSession = async () => {
  console.log("Iniciando sessão AR...");
  
  try {
    if (!navigator.xr) {
      throw new Error("WebXR não disponível");
    }

    const session = await navigator.xr.requestSession("immersive-ar", {
      requiredFeatures: ["hit-test", "dom-overlay"],
      domOverlay: { root: document.getElementById("ar-overlay") }
    });

    console.log("Sessão AR iniciada com sucesso");
    return session;
  } catch (error) {
    console.error("Erro ao iniciar sessão AR:", error);
    throw error;
  }
};

export const setupARCanvas = (canvas: HTMLCanvasElement) => {
  console.log("Configurando canvas AR...");
  
  const gl = canvas.getContext("webgl", {
    xrCompatible: true,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true
  });

  if (!gl) {
    console.error("WebGL não está disponível");
    throw new Error("WebGL não está disponível neste dispositivo");
  }

  // Configurações de otimização
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  
  // Limpar buffer com transparência
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  return gl;
};