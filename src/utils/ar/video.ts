import * as THREE from "three";

export const createVideoMaterial = (video: HTMLVideoElement): THREE.Material => {
  console.log("Criando material de vídeo...");
  
  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;
  texture.colorSpace = THREE.SRGBColorSpace;
  
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true
  });
  
  console.log("Material de vídeo criado com sucesso");
  return material;
};

export const updateVideoPlane = (
  plane: THREE.Mesh,
  scale: number,
  rotation: number
): void => {
  if (!plane) return;
  
  plane.scale.set(scale, scale, 1);
  plane.rotation.y = rotation;
};