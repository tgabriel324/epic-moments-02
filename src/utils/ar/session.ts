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