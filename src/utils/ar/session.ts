
export const initARSession = async (domOverlay: Element): Promise<XRSession> => {
  console.log("Iniciando sessão AR...");
  
  try {
    // Verificar suporte WebXR
    if (!navigator.xr) {
      console.log("WebXR não disponível, tentando modo de câmera simples");
      throw new Error("ar_not_supported");
    }

    // Verificar suporte específico para AR
    const isArSupported = await navigator.xr.isSessionSupported("immersive-ar");
    if (!isArSupported) {
      console.log("AR não suportado neste dispositivo");
      throw new Error("ar_not_supported");
    }

    // Verificar sessões existentes
    const sessions = await (navigator as any).xr.getSessions?.();
    if (sessions?.length > 0) {
      console.log("Encerrando sessão AR anterior...");
      await Promise.all(sessions.map((session: XRSession) => session.end()));
    }

    // Configurar sessão com recursos necessários
    const sessionInit: XRSessionInit = {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["dom-overlay", "camera-access"],
      domOverlay: domOverlay ? { root: domOverlay } : undefined
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
