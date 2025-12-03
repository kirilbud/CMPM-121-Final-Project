import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'

//to be implemented
export class WorldObject {
    constructor(scene, cannon, position) {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
        this.material = new THREE.MeshPhongMaterial({ color: 0xf48072 })
        this.scene = scene
        this.cannon = cannon
        this.position = position
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.physicsObject = new PhysicsObject()
    }

    setgltf(url) {
        gltfLoader.load(url, (gltf) => {
            const root = gltf.scene
            root.scale.set(1, 1, 1)
            root.position.set(this.position)
            scene.add(root)

            this.mixer = new THREE.AnimationMixer(root)
            this.geometry = root

            const clips = gltf.animations

            //add all animations to a dictionary
            this.animations = clips

            const clip = this.actions['idle']
            const action = this.mixer.clipAction(clip)
            action.play()
            //make sure to do action.stop before playing another animation
        })
    }

    update(delta) {}
}
