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
    readonly enabledFeatures: string[];
    requestReferenceSpace(type: string): Promise<XRReferenceSpace>;
    requestAnimationFrame(callback: XRFrameRequestCallback): number;
    end(): Promise<void>;
  }
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

// Tipos globais do WebXR
declare global {
  type XRFrameRequestCallback = (time: DOMHighResTimeStamp, frame: XRFrame) => void;
  
  interface XRRigidTransform {
    position: DOMPointReadOnly;
    orientation: DOMPointReadOnly;
    matrix: Float32Array;
    inverse: XRRigidTransform;
  }
  
  interface XRSpace {}
  
  interface XRFrame {
    session: XRSession;
    getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | null;
    getPose(space: XRSpace, baseSpace: XRSpace): XRPose | null;
  }
  
  interface XRView {
    eye: 'left' | 'right' | 'none';
    projectionMatrix: Float32Array;
    transform: XRRigidTransform;
  }
  
  interface XRViewerPose {
    transform: XRRigidTransform;
    views: XRView[];
  }
  
  interface XRPose {
    transform: XRRigidTransform;
    emulatedPosition: boolean;
  }
  
  interface XRReferenceSpace extends XRSpace {
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
  }
}

export {};