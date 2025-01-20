export interface XRImageTracker {
  tracked: boolean;
  trackingState: "tracked" | "emulated" | "limited";
  lastKnownPose: XRPose | null;
}

export interface ARSessionConfig {
  requiredFeatures: string[];
  imageTrackingOptions?: {
    trackingMode: "best-quality" | "low-latency";
  };
}

export interface ImageTrackingResult {
  success: boolean;
  error?: string;
  pose?: XRPose;
}