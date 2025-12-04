import * as THREE from 'three'
import { GLTFLoader } from './lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
//our classes
import { Robot } from './Robot.js'
import { PhysicsObject } from './worldObjectClasses/PhysicsObject.js'
import { WorldObject } from './worldObjectClasses/worldObject.js'
import { Level } from './Level.js'
import { Platform } from './worldObjectClasses/Platform.js'
import { Level_1 } from './WorldData.js'
import { gameMenu } from './WorldData.js'

let canPlace = false
let buildPoint = new CANNON.Vec3(0, 0, 0)

//wack ass onload work around
window.onload = function () {
    main()
}

//constants
const CAMERA_FOV = 60
const MOUSE_SENSITIVITY = 0.03

const mainDiv = document.querySelector('#mainDiv')

const uiDiv = document.createElement('div')
uiDiv.innerText = 'hellaur'
uiDiv.style.backgroundColor = 'black'
uiDiv.style.color = 'white'
uiDiv.style.fontSize = '200%'

mainDiv.appendChild(uiDiv)

//GLOBALS
//g_ stands for this variable being a global variable
let g_canvas
let g_renderer
let g_camera
let g_camera_pivot
let g_scene
const g_raycaster = new THREE.Raycaster()
let g_clock = new THREE.Clock() // use this for delta time
let g_ground
let g_level

let g_dragging = false

//this array holds all of the robots
let g_robots = []

//what the camera will be looking at and following
let g_focus

let g_mouse_last_pos

const g_cannon_world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
})

const g_physicsStep = new Event('physicsStep')

class mouseVector {
    constructor() {
        ;(this.x = 0), (this.y = 0)
    }
    set(x, y) {
        this.x = x
        this.y = y
    }
}

class Item {
    constructor(nameInput, countInput, numInput) {
        this.name = nameInput
        this.count = countInput
        this.objnumber = numInput
    }
    getName() {
        return this.name
    }
    getCount() {
        return this.count
    }
    setCount(input) {
        this.count = input
    }
    instantiate(position) {
        return
    }
}

class Wall {
    constructor() {
        ;(this.shape = new CANNON.Box(new CANNON.Vec3(5, 10, 1))),
            (this.geometry = new THREE.BoxGeometry(5, 10, 1)),
            (this.obj = new PhysicsObject(this.geometry, this.shape)),
            this.obj.mesh.layers.enable(3)
        this.material = new THREE.MeshPhongMaterial({ color: 0x880808 })
        this.obj.setColor(new THREE.Color(0xffffff))
        this.obj.setMass(0)
    }
    instantiate(inputScene, inputWorld) {
        inputScene.add(this.obj.mesh)
        inputWorld.addBody(this.obj.body)
    }
    instantiateAtPos(inputScene, inputWorld, position) {
        if (typeof (position == CANNON.Vec3)) {
            this.instantiate(inputScene, inputWorld)
            this.obj.body.position.copy(position)
            this.obj.mesh.position.copy(position)
        }
    }
}

//variables :3

let inventory = [new Item('platform', 3, new Platform(g_scene, 20))]

function main() {
    //set up Three.js
    const canvas = document.querySelector('#c')
    canvas.addEventListener('mousedown', (event) => {
        //check what button the player is clicking
        //0 for left click
        //2 for right click
        const rect = canvas.getBoundingClientRect()
        const xCoord = event.clientX - rect.left
        const yCoord = event.clientY - rect.top
        if (event.button == 0) {
            const newWall = new Wall()
            if (canPlace) {
                newWall.instantiateAtPos(g_scene, g_cannon_world, buildPoint)
            }
        } else if (event.button == 2) {
            g_dragging = true
            g_mouse_last_pos = new mouseVector()
            g_mouse_last_pos.set(xCoord, yCoord)
        }
    })

    canvas.addEventListener('mouseup', (event) => {
        //check if player let go of the camera
        if (event.button == 2) {
            g_dragging = false
            g_mouse_last_pos = null
        }
    })

    canvas.addEventListener('pointermove', (e) => {
        const mouse = new THREE.Vector2()
        mouse.x = (e.clientX / canvas.width) * 2 - 1
        mouse.y = -(e.clientY / canvas.height) * 2 + 1

        g_raycaster.setFromCamera(mouse, g_camera)

        const intersects = g_raycaster.intersectObjects(g_scene.children, true)
        if (intersects.length > 0) {
            const front = intersects[0].object
            if (front.layers.mask == 5) {
                canPlace = true
                const point = intersects[0].point
                buildPoint = new CANNON.Vec3(0, point.y + 5, point.z)
            } else {
                canPlace = false
                buildPoint = new CANNON.Vec3(0, 0, 0)
            }
        }
    })

    canvas.addEventListener('mousemove', (event) => {
        if (g_dragging) {
            let start_vector = new THREE.Vector2(
                g_mouse_last_pos.x,
                g_mouse_last_pos.y
            )
            let end_vector = new THREE.Vector2(event.x, event.y)
            let move_vector = start_vector.sub(end_vector)
            g_focus.position.z =
                g_focus.position.z + move_vector.x * MOUSE_SENSITIVITY
            g_focus.position.y =
                g_focus.position.y - move_vector.y * MOUSE_SENSITIVITY
            g_mouse_last_pos.set(event.x, event.y)
        }
    })

    //removes the right click popup
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault()
    })
    g_canvas = canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
    g_renderer = renderer

    //create cammera
    const fov = CAMERA_FOV
    const aspect = 2 // the canvas default
    const near = 0.1
    const far = 1000
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    //used for rotating along x axis
    g_focus = new THREE.Object3D()

    //create scene
    const scene = new THREE.Scene()
    g_scene = scene

    g_scene.add(g_focus)

    // Load and set the background texture
    var loader = new THREE.TextureLoader()

    loader.load('./graph4.png', function (texture) {
        g_scene.background = texture
    })

    //set camera
    g_focus.add(camera)
    g_camera_pivot = g_focus
    g_camera = camera

    camera.rotation.y = -Math.PI / 2

    camera.position.z = 4
    camera.position.y = 0
    camera.position.x = -12

    g_camera_pivot.position.z = 5
    g_camera_pivot.position.y = -5
    g_camera_pivot.position.x = 0

    //Lighting
    //add ambient light aka what colors are the shadows
    var ambient_light = new THREE.AmbientLight(0xffffff, 0.7)
    g_scene.add(ambient_light)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(-1, 1, -1)
    directionalLight.target.position.set(0, 0, 0)
    g_scene.add(directionalLight)

    //add robots
    //const robot = new Robot(g_scene, g_cannon_world, new CANNON.Vec3(0, 3, -3))
    //g_robots.push(robot)

    //initially render the scene
    g_renderer.render(scene, camera)

    //load level
    g_level = new Level(g_scene, g_cannon_world, gameMenu)

    requestAnimationFrame(render)
}

// returns true if the canvas needs to be resized due to the browser being resized
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height //checks if the current dementions are the same as the ones the canvas is  at
    if (needResize) {
        renderer.setSize(width, height, false)
    }
    return needResize
}

let lastTime = performance.now()

//function that renders the whole scene and is called with requestAnimationFrame
function render(time) {
    const dt = g_clock.getDelta()

    g_cannon_world.step(1 / 120, dt, 10)

    //update all robots
    for (let index = 0; index < g_robots.length; index++) {
        const robot = g_robots[index]
        robot.update(dt)
    }

    //fix stretch
    if (resizeRendererToDisplaySize(g_renderer)) {
        //check if the display needs to be updated
        const canvas = g_renderer.domElement
        g_camera.aspect = canvas.clientWidth / canvas.clientHeight
        g_camera.updateProjectionMatrix()
    }
    g_renderer.render(g_scene, g_camera) //render the next frame

    //render level
    g_level.update(dt)

    dispatchEvent(g_physicsStep)
    requestAnimationFrame(render)
}

function setupInventoryUI() {
    console.log('adding buttons!')
    const buttonsDiv = document.createElement('div')
    uiDiv.appendChild(buttonsDiv)
    buttonsDiv.id = 'buttonsDiv'
    for (const i of inventory) {
        console.log('added button!')
        const newButton = document.createElement('button')
        newButton.innerText = i.name + ' x' + i.count
        buttonsDiv.appendChild(newButton)
    }
}
setupInventoryUI()
