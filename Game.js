import * as THREE from 'three';
import {GLTFLoader} from './lib/addons/GLTFLoader.js';
//import {Robot} from './Robot.js';

//wack ass onload work around
window.onload = function() {main()}

//GLOBALS
let g_canvas;
let g_renderer;
let g_camera;
let g_scene;
const g_raycaster = new THREE.Raycaster();
let g_clock = new THREE.Clock();


function main(){

    //set up Three.js
    const canvas = document.querySelector('#c');
    g_canvas = canvas;
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    g_renderer = renderer;

    //create cammera
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    //set camera pos
    camera.position.z = -10;
    camera.position.y = 4;
    camera.position.x = -10;
    g_camera = camera;

    //create scene
    const scene = new THREE.Scene();
    g_scene = scene;

    //initially render the scene
    g_renderer.render(scene, camera);

    requestAnimationFrame(render);
}


// returns true if the canvas needs to be resized due to the browser being resized
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;//checks if the current dementions are the same as the ones the canvas is  at
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}

//function that renders the whole scene and is called with requestAnimationFrame
function render(time) {
   
    //fix stretch
    if (resizeRendererToDisplaySize(g_renderer)) {//check if the display needs to be updated
        const canvas = g_renderer.domElement;
        g_camera.aspect = canvas.clientWidth / canvas.clientHeight;
        g_camera.updateProjectionMatrix();
    }


   
    g_renderer.render(g_scene, g_camera);//render the next frame
   
    requestAnimationFrame(render);
}

