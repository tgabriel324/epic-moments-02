export interface ARViewSettings {
  background_color: string;
  landing_page_primary_color: string;
  landing_page_title: string;
  landing_page_description: string;
  landing_page_logo_url?: string;
}

export interface ARTrackingState {
  isTracking: boolean;
  confidence: number;
}

export interface ARVideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
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
  trackingData?: {
    imageWidth: number;
    imageHeight: number;
    featurePoints: number[];
  };
}

export interface XRReferenceSpace extends XRSpace {
  getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
}

export interface ARSceneState {
  xrSession: XRSession | null;
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  videoPlane: THREE.Mesh | null;
}

export interface ARControlsState {
  scale: number;
  rotation: number;
}

declare global {
  interface XRSession {
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>;
    updateRenderState(state: XRRenderState): Promise<void>;
    requestAnimationFrame(callback: XRFrameRequestCallback): number;
    end(): Promise<void>;
  }
}