//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.js Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(80, 16000 / 16000, 0.1, 1000);

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
        object.position.set(0, -7, 0);

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
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Alpha: true allows for the transparent background
const container = document.getElementById("container3D");
const width = container.clientWidth;
const height = container.clientHeight;

renderer.setSize(width, height);

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
camera.position.z = 22; // Adjust the camera's Z position

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); // top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "modelo" ? 5 : 1);
scene.add(ambientLight);

// Rotation speed of the model
const rotationSpeed = 0.003;

// Variable to track if mouse is pressed
let isMousePressed = false;
// Variables to track mouse position
let lastMouseX = 0;
let lastMouseY = 0;

// Function to handle mouse down (start of drag)
function handleMouseDown(event) {
    isMousePressed = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

// Function to handle mouse up (end of drag)
function handleMouseUp(event) {
    isMousePressed = false;
}

// Function to handle mouse move (dragging)
function handleMouseMove(event) {
    if (isMousePressed) {
        let deltaX = event.clientX - lastMouseX;
        let deltaY = event.clientY - lastMouseY;

        object.rotation.y += deltaX * 0.01; // Adjust rotation based on mouse movement
        object.rotation.x += deltaY * 0.01;

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
}

// Event listeners for mouse events
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', handleMouseMove);

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Rotate the model around its Y axis
    if (object && objToRender === "modelo" && !isMousePressed) {
        object.rotation.y += rotationSpeed;
    }

    renderer.render(scene, camera);
}
