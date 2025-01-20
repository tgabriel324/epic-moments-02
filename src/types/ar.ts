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
}

export interface ARVideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export interface ARControlsState {
  scale: number;
  rotation: number;
}

export interface ARSceneState {
  xrSession: XRSession | null;
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  videoPlane: THREE.Mesh | null;
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

// Extensões do WebXR
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
  }
}

export {};