export interface XRSystem {
  isSessionSupported(mode: string): Promise<boolean>;
  requestSession(mode: string, options?: any): Promise<XRSession>;
}

declare global {
  interface Navigator {
    xr?: XRSystem;
  }
}