import * as THREE from 'three'
import { GLTFLoader } from './lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
//import {g_clock} from './Game.js';

export class Robot {
    //using code I stole from the actor class
    constructor(scene, cannon_world, position) {
        const scale = 0.18
        const RAYCAST_LEN = 0.8
        //robot variables
        this.up = new THREE.Vector3(0, 1, 0)
        this.forward = new THREE.Vector3(1, 0, 0) //the direction the bot is walking
        this.speed = 1
        this.animations = null //this holds the animations of the bot
        this.mixer //animation mixer for the bot
        this.bot //the robots mesh
        this.scene = scene
        this.clips = {} //dictionary for actions for easy stop start

        //physics variables
        this.bodyShape = new CANNON.Box(new CANNON.Vec3(0.2, 0.5, 0.1))
        this.body = new CANNON.Body({ mass: 1, shape: this.bodyShape })
        this.body.angularDamping = 1

        //restricts movement to a 2D axis.
        this.body.linearFactor = new THREE.Vector3(0, 1, 1)

        //by default, actor moves left.
        this.dir = -1

        //raycast that reverses direction upon contact.
        this.wallCheck = new THREE.Raycaster(
            this.body.position,
            new THREE.Vector3(0, 0, RAYCAST_LEN * this.dir),
            0,
            1
        )
        this.wallCheck.layers.set(3)

        this.groundCheck = new THREE.Raycaster(
            this.body.position,
            new THREE.Vector3(0, -0.1, 0)
        )
        this.groundCheck.layers.set(2)

        const gltfLoader = new GLTFLoader()
        let url = './glb/UV_the_robot.glb'
        gltfLoader.load(url, (gltf) => {
            const root = gltf.scene
            root.scale.set(scale, scale, scale)
            root.position.set(position)
            scene.add(root)

            this.mixer = new THREE.AnimationMixer(root)
            this.bot = root

            const clips = gltf.animations

            //add all animations to a dictionary
            this.animations = clips

            this.clips['Run'] = THREE.AnimationClip.findByName(clips, 'Run') //find the run animation
            this.clips['Fall'] = THREE.AnimationClip.findByName(clips, 'Fall') //find the fall animation
            this.clips['Idle'] = THREE.AnimationClip.findByName(clips, 'Idle') //find the idle animation

            const clip = this.clips['Run']
            const action = this.mixer.clipAction(clip)
            action.play()
            //make sure to do action.stop before playing another animation
        })

        //add physics event
        self.addEventListener('physicsStep', () => {
            if (this.bot !== undefined) {
                this.bot.position.copy(this.body.position)
                this.bot.position.y = this.bot.position.y - 1
                //ignore the wierd math its just to get this.dir to go from -1 and 1 to 0 and -1
                this.bot.rotation.y = Math.PI * (this.dir * 0.5 - 0.5)
            }
            const groundIntersects = this.groundCheck.intersectObjects(
                this.scene.children,
                true
            )
            if (groundIntersects.length > 0) {
                this.body.velocity.z = 1 * this.dir
            }
            const wallIntersects = this.wallCheck.intersectObjects(
                this.scene.children,
                true
            )
            if (wallIntersects.length > 0) {
                console.log('hit wall')
                this.dir *= -1
                this.body.velocity.z = 1 * this.dir

                this.wallCheck.set(
                    this.body.position,
                    new THREE.Vector3(0, 0, RAYCAST_LEN * this.dir),
                    1
                )
            }
        })

        //add to physics world
        this.body.position.copy(position)
        cannon_world.addBody(this.body)
    }

    //called every frame compaired to each phyisics frame
    update(delta) {
        //update the animations
        if (this.mixer) this.mixer.update(delta)
    }

    //need to put a state machine up in this to make it work well
}
