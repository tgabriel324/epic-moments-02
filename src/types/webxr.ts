// Define basic XR types
export interface XRSystem {
  isSessionSupported(mode: XRSessionMode): Promise<boolean>;
  requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession>;
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

// Augment the Navigator interface globally
declare global {
  interface Navigator {
    xr?: XRSystem;
  }
}