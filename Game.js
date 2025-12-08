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
import { Cursor } from './Cursor.js'

//constants
const CAMERA_FOV = 60 // camera zoom
const MOUSE_SENSITIVITY = 1

const mainDiv = document.querySelector('#mainDiv')

export const uiDiv = document.createElement('div')
uiDiv.style.backgroundColor = 'black'
uiDiv.style.color = 'white'
uiDiv.style.fontSize = '200%'

const invDiv = document.createElement('div')
invDiv.innerText = 'Inventory: '

mainDiv.appendChild(uiDiv)
uiDiv.appendChild(invDiv)

//contains settings for language and theme.
const settingsDiv = document.createElement('div')
mainDiv.appendChild(settingsDiv)

//contains ui for saving.
const saveDiv = document.createElement('div')
mainDiv.appendChild(uiDiv)

const delSaveButton = document.createElement('button')
delSaveButton.textContent = 'Delete Save'
saveDiv.appendChild(delSaveButton)

//GLOBALS
//g_ stands for this variable being a global variable
let g_canvas
let g_renderer
let g_camera
let g_camera_pivot
let g_scene
const g_raycaster = new THREE.Raycaster()
let g_clock = new THREE.Clock() // use this for delta time
let g_inventory
let g_ground
let g_level

export let g_is_dark_mode = true
export let g_robot_cannon_material
export let g_floor_cannon_material

let g_dragging = false

//this array holds all of the robots
let g_robots = []

//what the camera will be looking at and following
let g_focus

let g_mouse_last_pos

let g_current_item

let g_cursor

const g_cannon_world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
})

const g_physicsStep = new Event('physicsStep')
const placedEvent = new Event('itemUsed')
const ItemSetEvent = new Event('itemSet')

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
        this.id = numInput
    }
    getName() {
        return this.name
    }
    getCount() {
        return this.count
    }
    setCount(input) {
        this.count = input
        invDiv.dispatchEvent(ItemSetEvent)
    }
    instantiate(position) {
        return
    }
}

//variables :3
let canPlace = false
let buildPoint = new CANNON.Vec3(0, 0, 0)

//wack ass onload work around
window.onload = function () {
    main()
}

function main() {
    //set up Three.js
    const canvas = document.querySelector('#c')

    SetUpCanvasChungus(canvas)

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

    // g_scene.backgroundIntensity = 1
    //set camera
    g_focus.add(camera)
    g_camera_pivot = g_focus
    g_camera = camera

    camera.rotation.y = -Math.PI / 2

    camera.position.z = 0
    camera.position.y = 0
    camera.position.x = -12

    g_focus.position.z = 10
    g_focus.position.y = -6

    //Lighting
    //add ambient light aka what colors are the shadows
    var ambient_light = new THREE.AmbientLight(0xffffff, 0.3)
    g_scene.add(ambient_light)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(-1, 1, -1)
    directionalLight.target.position.set(0, 0, 0)
    g_scene.add(directionalLight)

    //initially render the scene
    g_renderer.render(scene, camera)

    //cursor setup
    g_cursor = new Cursor(g_focus, g_level, new THREE.Vector3(0))
    g_cursor.setMeshFromID(0)

    //set inventory
    let inventory = [
        new Item('None', 0, 0),
        new Item('platform', 3, 30),
        new Item('Spring', 1, 60),
    ]
    setUpInventoryUI(inventory)
    g_inventory = inventory

    //set current item
    g_current_item = null

    console.log(' mode')

    //load level
    g_level = new Level(g_scene, g_cannon_world, gameMenu, inventory)

    if (window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Dark
            console.log('dark mode')
            SetDarktMode()
        } else {
            // Light
            console.log('light mode')
            SetLightMode()
        }
    } else {
        console.log('goblin mode')
        SetDarktMode()
        // sets it to goblin mode and steals players files or something idc anymore
    }

    g_robot_cannon_material = new CANNON.Material('noBounceMaterial')
    g_floor_cannon_material = new CANNON.Material('groundMaterial')
    let interact = new CANNON.ContactMaterial(
        g_robot_cannon_material,
        g_floor_cannon_material,
        { restitution: 0 }
    )

    requestAnimationFrame(render)
}

function setUpSettingsUI {

}

//sets up the canvas chungus!!!! :D
function SetUpCanvasChungus(canvas) {
    canvas.addEventListener('mousedown', (event) => {
        //check what button the player is clicking
        //0 for left click
        //2 for right click
        const rect = canvas.getBoundingClientRect()
        const xCoord = event.clientX - rect.left
        const yCoord = event.clientY - rect.top
        if (event.button == 0 && g_current_item != null) {
            if (
                g_current_item.getCount() > 0 &&
                g_current_item.name != 'None'
            ) {
                if (
                    !g_level.getObject(
                        g_cursor.getPosition().x,
                        g_cursor.getPosition().y
                    )
                ) {
                    const newObj = g_level.placeObject(
                        g_cursor.getPosition().x,
                        g_cursor.getPosition().y,
                        g_current_item.id
                    )

                    g_current_item.setCount(g_current_item.getCount() - 1)
                    uiDiv.dispatchEvent(placedEvent)
                }
            }
        } 
        /*else if (event.button == 2) {
            g_dragging = true
            g_mouse_last_pos = new mouseVector()
            g_mouse_last_pos.set(Math.floor(xCoord), Math.floor(yCoord))
        }*/
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
        const limitY = new THREE.Vector2(5, -10)
        const limitX = new THREE.Vector2(10, -10)

        if (g_dragging) {
            let start_vector = new THREE.Vector2(
                g_mouse_last_pos.x,
                g_mouse_last_pos.y
            )
            let end_vector = new THREE.Vector2(
                Math.floor(event.x),
                Math.floor(event.y)
            )
            let move_vector = start_vector.sub(end_vector)

            g_focus.position.z =
                g_focus.position.z + move_vector.x * MOUSE_SENSITIVITY
            g_focus.position.y =
                g_focus.position.y - move_vector.y * MOUSE_SENSITIVITY

            g_mouse_last_pos.set(Math.floor(event.x), Math.floor(event.y))
            console.log(g_focus.position)
        }
    })
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

    g_cannon_world.step(1 / 120, dt / 2, 10)

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
    uiDiv.dispatchEvent(ItemSetEvent)
    requestAnimationFrame(render)
}

function setUpInventoryUI(inv) {
    console.log('adding buttons!')
    const buttonsDiv = document.createElement('div')
    uiDiv.appendChild(buttonsDiv)
    buttonsDiv.id = 'buttonsDiv'

    for (const i of inv) {
        const storedValue = i
        console.log('added button!')
        const newButton = document.createElement('button')
        newButton.innerText = i.name + ' x' + i.count
        buttonsDiv.appendChild(newButton)

        newButton.addEventListener('click', () => {
            console.log('setting item to: ', i.name)
            console.log('item id is ', storedValue.id)
            g_current_item = storedValue
            g_cursor.setMeshFromID(storedValue.id)
        })

        invDiv.addEventListener('itemSet', () => {
            if (i.name != 'None') {
                newButton.innerText = i.name + ' x' + i.count
            } else {
                newButton.innerText = 'None'
            }
        })

        invDiv.addEventListener('itemUsed', () => {
            console.log(
                'current item current count: ',
                g_current_item.getCount()
            )
            if (i.name != 'None') {
                newButton.innerText = i.name + ' x' + i.count
            } else {
                newButton.innerText = 'None'
            }
        })
    }
}

//removes the right click popup
document.addEventListener('contextmenu', function (event) {
    event.preventDefault()
})

window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
        console.log(event.matches)
        if (event.matches) {
            //dark mode
            g_is_dark_mode = true
        } else {
            //light mode
            g_is_dark_mode = false
        }
    })

function SetLightMode() {
    g_is_dark_mode = false

    // Load and set the background texture
    var loader = new THREE.TextureLoader()

    loader.load('./graph6.png', function (texture) {
        g_scene.background = texture
    })

    uiDiv.style.backgroundColor = 'white'
    uiDiv.style.color = 'black'
}

function SetDarktMode() {
    g_is_dark_mode = true

    // Load and set the background texture
    var loader = new THREE.TextureLoader()

    loader.load('./textures/darkermode.png', function (texture) {
        g_scene.background = texture
    })

    uiDiv.style.backgroundColor = 'black'
    uiDiv.style.color = 'white'
    document.body.style.backgroundColor = 'black'
}

delSaveButton.addEventListener('click', function () {
    console.log('removing save')
    localStorage.clear()
})
