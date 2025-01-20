export interface XRSystem {
  isSessionSupported(mode: string): Promise<boolean>;
  requestSession(mode: string, options?: any): Promise<XRSession>;
}

// Instead of redeclaring Navigator, we'll augment the existing interface
declare global {
  interface Navigator {
    xr?: XRSystem | undefined;
  }
}