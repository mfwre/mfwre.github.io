import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

function animate() {
    renderer.render(scene, camera);
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

camera.position.set(7.5, 3.75, 15);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new GLTFLoader();
loader.load("/static/3d/owl.glb", function(gltf) {
    controls.update();
    scene.add(gltf.scene);
});

var ambientLight = new THREE.AmbientLight(0xcccccc);
scene.add(ambientLight);

renderer.setAnimationLoop(animate);
