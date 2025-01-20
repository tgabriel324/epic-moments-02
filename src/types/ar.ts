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
  pose?: XRPose;
}