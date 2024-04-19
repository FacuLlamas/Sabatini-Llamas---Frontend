//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.js Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, 400 / 300, 10, 100);

// Keep the 3D object on a global variable so we can access it later
let object;

// Set which object to render
let objToRender = 'modelo';

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
    `models/${objToRender}/AirJordan.gltf`,
    function (gltf) {
        // If the file is loaded, add it to the scene
        object = gltf.scene;
        scene.add(object);

        // Set initial position of the object
        object.position.set(0, 0, 0);

        // Start the animation
        animate();
    },
    function (xhr) {
        // While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        // If there is an error, log it
        console.error(error);
    }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
camera.position.z = 25; // Adjust the camera's Z position

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); // top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

// Variable to track the rotation speed
let rotationSpeed = 0.01;

// Function to handle mouse drag
function handleMouseDrag(event) {
    if (isDragging) {
        let deltaX = event.clientX - lastMouseX;

        // Adjust the rotation speed of the object based on mouse movement
        rotationSpeed = deltaX * 0.001;
    }
}

// Event listener for mouse movement
document.addEventListener('mousemove', handleMouseDrag);

// Variables to track mouse position and drag state
let lastMouseX = 0;
let isDragging = false;

// Event listener for mouse down (start of drag)
document.addEventListener('mousedown', function (event) {
    isDragging = true;
    lastMouseX = event.clientX;
});

// Event listener for mouse up (end of drag)
document.addEventListener('mouseup', function (event) {
    isDragging = false;
});

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Rotate the model around its Y axis
    if (object && objToRender === "modelo" && !isDragging) {
        object.rotation.y += rotationSpeed;
    }

    renderer.render(scene, camera);
}

// Event listener to adjust camera aspect ratio and renderer size when the window is resized
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
