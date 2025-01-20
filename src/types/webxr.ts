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
    enabledFeatures: string[];
    requestReferenceSpace(type: string): Promise<XRReferenceSpace>;
    requestAnimationFrame(callback: XRFrameRequestCallback): number;
    end(): Promise<void>;
  }
}

export interface XRTrackedImage {
  trackingState: "tracked" | "emulated" | "limited";
  imageSpace: XRSpace;
}

// Tipos globais do WebXR
declare global {
  interface XRRigidTransform {
    readonly position: DOMPointReadOnly;
    readonly orientation: DOMPointReadOnly;
    readonly matrix: Float32Array;
    readonly inverse: XRRigidTransform;
  }
  
  interface XRSpace {}
  
  interface XRFrame {
    readonly session: XRSession;
    getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | null;
    getPose(space: XRSpace, baseSpace: XRSpace): XRPose | null;
  }
  
  interface XRView {
    readonly eye: 'left' | 'right' | 'none';
    readonly projectionMatrix: Float32Array;
    readonly transform: XRRigidTransform;
  }
  
  interface XRViewerPose {
    readonly transform: XRRigidTransform;
    readonly views: readonly XRView[];
  }
  
  interface XRPose {
    readonly transform: XRRigidTransform;
    readonly emulatedPosition: boolean;
  }
  
  interface XRReferenceSpace extends XRSpace {
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
  }
}

export {};