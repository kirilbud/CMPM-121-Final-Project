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
let g_ground

const world = new CANNON.World( {
    gravity: new CANNON.Vec3(0,-9.81,0)
} );

const physicsStep = new Event("physicsStep");

class PhysicsObject {
    constructor(inputGeometry, inputShape) {
        this.geometry = inputGeometry;
        this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.mesh = new THREE.Mesh(this.geometry,this.material);
        this.layers = this.mesh.layers
        this.bodyShape = inputShape;
        this.body = new CANNON.Body({ shape: this.bodyShape })
    }
    setMass(massInput) {
        this.body.mass = massInput
        if (massInput <= 0) {
            this.body.type = CANNON.Body.STATIC
        }
        else {
            this.body.type = CANNON.Body.DYNAMIC
        }
        this.body.updateMassProperties()
    }
    setColor(inputColor) {
        this.material.color = inputColor
    }
    instantiate(inputScene, inputWorld) {
        inputScene.add(this.mesh)
        inputWorld.addBody(this.body)

        self.addEventListener("physicsStep", () => {
            //console.log(this.mesh.position.y + " - " + this.body.position.y)
            if (this.body.position) {
                this.mesh.position.copy(this.body.position)
                this.mesh.quaternion.copy(this.body.quaternion)
            }
        })
    }
    instantiateAtPos(inputScene, inputWorld, position) {
        if (typeof(position == CANNON.Vec3)) {
            this.instantiate(inputScene,inputWorld)
            this.body.position.copy(position)
        }
    }
    
}

class Actor {
    constructor() {
        this.bodyShape = new CANNON.Cylinder(0.5,0.5,1,12);
        this.body = new CANNON.Body({mass: 1, shape: this.bodyShape});
        this.body.angularDamping = 1;
        
        //restricts movement to a 2D axis.
        this.body.linearFactor = new THREE.Vector3(0,1,1)

        this.geometry = new THREE.CylinderGeometry(0.5,0.5,1,12);
        this.material = new THREE.MeshBasicMaterial( { color: 0x880808} )
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.layers.set(0)

        this.locationReachedEvent = new Event("locationReached");

        this.groundCheck = new THREE.Raycaster(this.body.position, new THREE.Vector3(0,-.1,0))
        this.groundCheck.layers.set(2)

        //by default, actor moves left.
        this.dir = -1

        //raycast that reverses direction upon contact.
        this.wallCheck = new THREE.Raycaster(this.body.position, new THREE.Vector3(0,0,1 * this.dir), 0, 1)
        this.wallCheck.layers.set(3)

        self.addEventListener("physicsStep", () => {
            //console.log(this.mesh.position.y + " - " + this.body.position.y)
            if (this.body.position) {
                this.mesh.position.copy(this.body.position)
                this.mesh.quaternion.copy(this.body.quaternion)
            }
            const groundIntersects = this.groundCheck.intersectObjects(g_scene.children, true);
            if (groundIntersects.length > 0) {
                this.body.velocity.z = 1 * this.dir;
            }
            const wallIntersects = this.wallCheck.intersectObjects(g_scene.children, true);
            if (wallIntersects.length > 0) {
                console.log("hit wall")
                this.dir *= -1
                this.body.velocity.z = 1 * this.dir

                this.wallCheck.set(this.body.position, new THREE.Vector3(0,0, 1 * this.dir), 1)
            }
        })
    }

    instantiate(inputScene, inputWorld) {
        inputScene.add(this.mesh)
        inputWorld.addBody(this.body)
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

    //set camera
    pivot.add(camera)
    g_camera_pivot = pivot;
    g_camera = camera;

    g_camera_pivot.position.z = -2
    g_camera_pivot.position.y = 1
    g_camera_pivot.position.x = 10

    rotateCamera(new THREE.Vector3(1,0,0), THREE.MathUtils.degToRad(-45))
    rotateCamera(new THREE.Vector3(0,1,0), THREE.MathUtils.degToRad(90))

    
    //add Meshes to Scene
    const shapeCube = new CANNON.Box(new CANNON.Vec3(5,10,1));
    const geometryCube = new THREE.BoxGeometry(5,10,1);
    const cube = new PhysicsObject(geometryCube, shapeCube);
    cube.mesh.layers.enable(3)

    cube.setColor(new THREE.Color(0xffffff))
    cube.setMass(0);
    //layer 3 for colliding with walls
    cube.instantiateAtPos(g_scene, world,new CANNON.Vec3(0,0,-5));
    const secondcube = new PhysicsObject(geometryCube, shapeCube)
    secondcube.setColor(new THREE.Color(0xffffff))
    secondcube.instantiateAtPos(g_scene, world,new CANNON.Vec3(0,0,5));

    secondcube.mesh.layers.enable(3)


    //add ground plane
    const plane = new PhysicsObject(new THREE.PlaneGeometry(5,20), new CANNON.Box(new CANNON.Vec3(2.5,9,1)));
    plane.instantiateAtPos(g_scene,world, new CANNON.Vec3(0,-5,0));
    plane.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), THREE.MathUtils.degToRad(-90))
    //layer 2 for colliding with ground
    plane.mesh.layers.enable(2);
    g_ground = plane.mesh

    //add player
    const player = new Actor()
    player.instantiate(g_scene, world);

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

let lastTime = performance.now();

function step() {
    //steps the physics world forward
    const time = performance.now() / 1000;
    const dt= time - lastTime;
    lastTime = time
    world.step(1/120, dt, 10);
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
