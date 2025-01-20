import * as THREE from "three";

export const setupARCanvas = (container: HTMLCanvasElement): THREE.WebGLRenderer => {
  console.log("Configurando canvas AR...");
  
  const renderer = new THREE.WebGLRenderer({
    canvas: container,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  
  console.log("Canvas AR configurado com sucesso");
  return renderer;
};

export const handleResize = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): void => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};