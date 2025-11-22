import * as THREE from 'three';
import {GLTFLoader} from './lib/addons/GLTFLoader.js';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';
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

const world = new CANNON.World( {
    gravity: new CANNON.Vec3(0,-9.81,0)
} );

const physicsStep = new Event("physicsStep");
class PhysicsObject {
    constructor(inputGeometry, inputShape) {
        this.geometry = inputGeometry;
        this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.mesh = new THREE.Mesh(this.geometry,this.material);

        this.bodyShape = inputShape;
        this.body = new CANNON.Body({ shape: this.bodyShape, mass: 10})
    }
    instantiate(inputScene, inputWorld) {
        inputScene.add(this.mesh)
        inputWorld.addBody(this.body)

        self.addEventListener("physicsStep", () => {
            console.log(this.mesh.position.y + " - " + this.body.position.y)
            if (this.body.position) {
                this.mesh.position.copy(this.body.position)
                this.mesh.quaternion.copy(this.body.quaternion)
            }
        })
    }
}



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
    
    const shape = new CANNON.Box(new CANNON.Vec3(1,1,1));



    //add Mesh to Scene
    const geometry = new THREE.BoxGeometry(1,1,1);
    const cube = new PhysicsObject(geometry, shape);

    cube.instantiate(g_scene, world)

    //initially render the scene
    g_renderer.render(scene, camera);

    requestAnimationFrame(render);
    step();
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

function step() {
    //steps the physics world forward
    world.step(1/60);
    dispatchEvent(physicsStep);
    requestAnimationFrame(step)
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
