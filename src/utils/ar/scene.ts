import * as THREE from "three";

export const createARScene = (): THREE.Scene => {
  console.log("Criando cena AR...");
  
  const scene = new THREE.Scene();
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 5, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);
  
  console.log("Cena AR criada com sucesso");
  return scene;
};

export const setupARCamera = (): THREE.PerspectiveCamera => {
  console.log("Configurando câmera AR...");
  
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  camera.position.z = 5;
  
  console.log("Câmera AR configurada com sucesso");
  return camera;
};