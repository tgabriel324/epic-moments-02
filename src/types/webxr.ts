// Extensão dos tipos nativos do WebXR
declare global {
  interface Navigator {
    xr?: XRSystem;
  }
  
  interface XRSystem {
    isSessionSupported(mode: string): Promise<boolean>;
    requestSession(mode: string, options?: XRSessionInit): Promise<XRSession>;
  }
  
  interface XRSession {
    enabledFeatures?: string[];
    requestReferenceSpace(type: string): Promise<XRReferenceSpace>;
    requestAnimationFrame(callback: XRFrameRequestCallback): number;
    end(): Promise<void>;
  }
  
  type XRFrameRequestCallback = (time: number, frame: XRFrame) => void;
}

export interface XRTrackedImage {
  trackingState: "tracked" | "emulated" | "limited";
  imageSpace: XRSpace;
}

export interface ARSessionConfig {
  requiredFeatures: string[];
  optionalFeatures?: string[];
  domOverlay?: {
    root: Element | null;
  };
}

export interface ImageTrackingResult {
  success: boolean;
  error?: string;
  pose?: XRPose;
}