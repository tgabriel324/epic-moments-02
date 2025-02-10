
export const initARSession = async (domOverlay: Element): Promise<XRSession> => {
  console.log("Iniciando sessão AR...");
  
  try {
    if (!navigator.xr) {
      throw new Error("WebXR não disponível");
    }

    // Verifica se já existe uma sessão ativa
    const sessions = await (navigator as any).xr.getSessions?.();
    if (sessions?.length > 0) {
      console.log("Encerrando sessão AR anterior...");
      await Promise.all(sessions.map((session: XRSession) => session.end()));
    }

    const sessionInit: XRSessionInit = {
      requiredFeatures: ["hit-test", "dom-overlay"],
      domOverlay: { root: domOverlay },
      optionalFeatures: ["image-tracking", "camera-access"]
    };

    console.log("Solicitando nova sessão AR...");
    const session = await navigator.xr.requestSession("immersive-ar", sessionInit);
    console.log("Sessão AR iniciada com sucesso");
    return session;
  } catch (error) {
    console.error("Erro ao iniciar sessão AR:", error);
    throw error;
  }
};
