import * as THREE from 'three';
import {GLTFLoader} from './lib/addons/GLTFLoader.js';
import * as CANNON from './lib/cannon.js'
//import {Robot} from './Robot.js';

//wack ass onload work around
window.onload = function() {main()}

//GLOBALS
let g_canvas;
let g_renderer;
let g_camera;
let g_camera_pivot;
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
    //used for rotating along x axis
    const pivot = new THREE.Object3D();

    //create scene
    const scene = new THREE.Scene();
    g_scene = scene;

    g_scene.add(pivot)
    pivot.add(camera)

    g_camera_pivot = pivot;
    g_camera = camera;

    //set camera pos

    g_camera_pivot.position.z = 1
    g_camera_pivot.position.y = 1
    g_camera_pivot.position.x = 1

    rotateCamera(new THREE.Vector3(0,1,0), THREE.MathUtils.degToRad(45))
    rotateCamera(new THREE.Vector3(1,0,0), THREE.MathUtils.degToRad(-45))

    // add mesh to scene
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    const cube = new THREE.Mesh( geometry, material );
    g_scene.add( cube );

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

function rotateCamera(axis, angle) {
    //determines if camera rotates by the pivot or camera itself.
    //NOTE: Camera can only rotate on x and y axes.
    console.log(axis)
    const y = new THREE.Vector3(0,1,0)
    const x = new THREE.Vector3(1,0,0)
    if (axis.y == 1 && (axis.x == 0)) {
        console.log("rotating y");
        g_camera_pivot.rotation.y = angle 
    }
    else if (axis.x == 1) {
        g_camera.rotation.x = angle
    }
    else{
        console.log("ERROR! Attempting to rotate on invalid axis.")
    }
}
