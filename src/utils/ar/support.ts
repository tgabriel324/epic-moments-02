import { toast } from "sonner";

export const checkXRSupport = async (): Promise<boolean> => {
  console.log("Verificando suporte WebXR...");
  
  if (!window.navigator.xr) {
    console.error("WebXR não disponível neste navegador");
    toast.error("Seu navegador não suporta realidade aumentada");
    return false;
  }

  try {
    const supported = await navigator.xr.isSessionSupported("immersive-ar");
    console.log("Suporte WebXR:", supported ? "Disponível" : "Indisponível");
    
    if (!supported) {
      toast.error("Seu dispositivo não suporta realidade aumentada");
    }
    
    return supported;
  } catch (error) {
    console.error("Erro ao verificar suporte WebXR:", error);
    toast.error("Erro ao verificar suporte para realidade aumentada");
    return false;
  }
};