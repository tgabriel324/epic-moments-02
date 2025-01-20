// Define basic XR types that we need and aren't provided by @types/webxr
export type XRSessionMode = "immersive-ar" | "immersive-vr" | "inline";

export interface XRSessionInit {
  optionalFeatures?: string[];
  requiredFeatures?: string[];
  domOverlay?: {
    root: Element | null;
  };
}