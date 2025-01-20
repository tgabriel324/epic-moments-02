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