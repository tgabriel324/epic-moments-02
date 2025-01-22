import * as THREE from 'three';

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
  lastUpdate?: number;
  error?: string;
  trackingData?: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  };
}

export interface ARVideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isBuffering?: boolean;
  volume?: number;
  playbackRate?: number;
}

export interface ARControlsState {
  scale: number;
  rotation: number;
  position?: THREE.Vector3;
  isLocked?: boolean;
}

export interface ARSceneState {
  xrSession: XRSession | null;
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  videoPlane: THREE.Mesh | null;
  lastFrameTime?: number;
  frameRate?: number;
}

export interface ImageTrackingResult {
  success: boolean;
  error?: string;
  trackingData?: {
    imageWidth: number;
    imageHeight: number;
    featurePoints: Float32Array;
  };
}

// WebXR Types
declare global {
  interface Navigator {
    xr?: XRSystem;
  }

  interface XRSystem {
    isSessionSupported(mode: string): Promise<boolean>;
    requestSession(mode: string, options?: XRSessionInit): Promise<XRSession>;
  }

  interface XRSession {
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>;
    updateRenderState(state: XRRenderState): Promise<void>;
    requestAnimationFrame(callback: XRFrameRequestCallback): number;
    end(): Promise<void>;
  }

  interface XRReferenceSpace extends XRSpace {
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
  }

  interface XRFrame {
    getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | null;
    getPose(space: XRSpace, baseSpace: XRSpace): XRPose | null;
    getImageTrackingResults?(): XRImageTrackingResult[];
  }
  
  interface XRImageTrackingResult {
    readonly imageSpace: XRSpace;
    readonly trackingState: XRTrackingState;
    readonly measuredWidthInMeters: number;
    readonly estimatedHeightInMeters: number;
  }
  
  type XRTrackingState = "tracked" | "limited" | "emulated";
}

export {};