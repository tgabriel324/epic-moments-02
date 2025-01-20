interface XRSystem {
  isSessionSupported(mode: string): Promise<boolean>;
  requestSession(mode: string, options?: any): Promise<XRSession>;
}

// Declare as extensões globais
declare global {
  interface Navigator {
    xr?: XRSystem;
  }
}

// Export types needed for XR sessions
export type XRSessionMode = "immersive-ar" | "immersive-vr" | "inline";

export interface XRSessionInit {
  optionalFeatures?: string[];
  requiredFeatures?: string[];
  domOverlay?: {
    root: Element | null;
  };
}