import * as THREE from 'three';
import {GLTFLoader} from './lib/addons/GLTFLoader.js';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';
//our classes
import {Robot} from './Robot.js';
import {PhysicsObject} from './PhysicsObject.js';
//import {WorldObject} from './WorldObject.js';

//wack ass onload work around
window.onload = function() {main()}

//GLOBALS
//g_ stands for this variable being a global variable
let g_canvas;
let g_renderer;
let g_camera;
let g_camera_pivot;
let g_scene;
const g_raycaster = new THREE.Raycaster();
let g_clock = new THREE.Clock(); // use this for delta time
let g_ground

let g_dragging = false

//this array holds all of the robots
let g_robots = []

const g_cannon_world = new CANNON.World( {
    gravity: new CANNON.Vec3(0,-9.81,0)
} );


const g_physicsStep = new Event("physicsStep");


class mouseVector {
    constructor() {
        this.x = 0,
        this.y = 0
    }
    set(x,y) {
        this.x = x
        this.y = y
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
        this.material = new THREE.MeshPhongMaterial( { color: 0x880808} )
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
    instantiateAtPos(inputScene, inputWorld, position) {
        if (typeof(position == CANNON.Vec3)) {
            this.instantiate(inputScene,inputWorld)
            this.body.position.copy(position)
        }
    }
}

class Wall {
    constructor() {
        this.shape = new CANNON.Box(new CANNON.Vec3(5,10,1)),
        this.geometry = new THREE.BoxGeometry(5,10,1),
        this.obj = new PhysicsObject(this.geometry, this.shape),
        this.obj.mesh.layers.enable(3)
        this.material = new THREE.MeshPhongMaterial( { color: 0x880808} )
        this.obj.setColor(new THREE.Color(0xffffff))
        this.obj.setMass(0)
    }
    instantiate(inputScene, inputWorld) {
        inputScene.add(this.obj.mesh)
        inputWorld.addBody(this.obj.body)
    }
    instantiateAtPos(inputScene, inputWorld, position) {
        if (typeof(position == CANNON.Vec3)) {
            this.instantiate(inputScene,inputWorld)
            this.obj.body.position.copy(position)
            this.obj.mesh.position.copy(position)
        }
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

    g_camera_pivot.position.z = -0.5
    g_camera_pivot.position.y = 1
    g_camera_pivot.position.x = 10

    rotateCamera(new THREE.Vector3(1,0,0), THREE.MathUtils.degToRad(-10))
    rotateCamera(new THREE.Vector3(0,1,0), THREE.MathUtils.degToRad(90))
     
    //Lighting
    //add ambient light aka what colors are the shadows
    var ambient_light = new THREE.AmbientLight(0xffffff, .3)
    g_scene.add(ambient_light)

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set(-1, 1, -1)
    directionalLight.target.position.set(0, 0, 0)
    g_scene.add( directionalLight );
    
    //add Meshes to Scene
    const cube= new Wall();
    //layer 3 for colliding with walls
    cube.instantiateAtPos(g_scene, g_cannon_world,new CANNON.Vec3(0,0,-5));
    const secondcube = new Wall();
    secondcube.instantiateAtPos(g_scene, g_cannon_world,new CANNON.Vec3(0,0,5));


    //add ground plane
    const plane = new PhysicsObject(new THREE.PlaneGeometry(5,20), new CANNON.Box(new CANNON.Vec3(2.5,9,1)));
    plane.instantiateAtPos(g_scene,g_cannon_world, new CANNON.Vec3(0,-5,0));
    plane.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), THREE.MathUtils.degToRad(-90))
    //layer 2 for colliding with ground
    plane.mesh.layers.enable(2);
    g_ground = plane.mesh

    //add player
    const player = new Actor()
    player.instantiateAtPos(g_scene, g_cannon_world, new CANNON.Vec3(1, 0,0));

    const robot = new Robot(g_scene,g_cannon_world, new CANNON.Vec3(0, 31,0) );
    g_robots.push(robot);

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
    const dt = g_clock.getDelta();

    g_cannon_world.step(1/120, dt, 10);

    //update all robots
    for (let index = 0; index < g_robots.length; index++) {
        const robot = g_robots[index];
        robot.update(dt);
    }


    dispatchEvent(g_physicsStep);
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

let canPlace = false;
let buildPoint = new CANNON.Vec3(0,0,0);

addEventListener("pointermove", (e) => {
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    g_raycaster.setFromCamera(mouse, g_camera);

    const intersects = g_raycaster.intersectObjects(g_scene.children, true)
    if (intersects.length > 0) {
        const front = intersects[0].object;
        if (front.layers.mask == 5) {
            canPlace = true
            const point = intersects[0].point
            buildPoint = new CANNON.Vec3(0, point.y + 5, point.z)
        }
        else {
        canPlace = false
        buildPoint = new CANNON.Vec3(0,0,0);
    }
    }
});

addEventListener("mousedown", (event) => {
    const newWall = new Wall();
    if (canPlace) {
        newWall.instantiateAtPos(g_scene, g_cannon_world, buildPoint);
    }

    //check what button the player is clicking
    //0 for left click
    //2 for right click
    if (event.button == 0) {
        console.log("left click")
    }else if (event.button == 2) {
        g_dragging = true;
    }
})

addEventListener("mouseup", (event) => {
    const newWall = new Wall();
    if (canPlace) {
        newWall.instantiateAtPos(g_scene, g_cannon_world, buildPoint);
    }

    //check if player let go of the camera
    if (event.button == 2) {
        g_dragging = false;
    }
})

//removes the right click popup
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});