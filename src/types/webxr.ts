// Define a interface básica do XRSystem
export interface XRSystem {
  isSessionSupported(mode: string): Promise<boolean>;
  requestSession(mode: string, options?: any): Promise<XRSession>;
}

// Estender a interface Navigator global
declare global {
  interface Navigator {
    xr: XRSystem | undefined;
  }
}