import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'

//to be implemented
export class WorldObject {
    constructor(scene, cannon, position) {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
        this.shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
        this.material = new THREE.MeshPhongMaterial({ color: 0xf48072 })
        this.scene = scene
        this.cannon = cannon
        this.position = position
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.copy(this.position)

        this.physicsObject = null
        if (this.scene && this.mesh) {
            //console.log(this.mesh.material)
            this.scene.add(this.mesh)
        }
        this.loaded = false
    }

    setgltf(url) {
        const gltfLoader = new GLTFLoader()
        gltfLoader.load(url, (gltf) => {
            const root = gltf.scene
            root.scale.set(0.5, 0.5, 0.5)
            root.position.set(this.position.x, this.position.y, this.position.z)
            this.scene.add(root)

            this.mixer = new THREE.AnimationMixer(root)
            this.mesh.removeFromParent()
            this.mesh = root

            this.clips = gltf.animations

            //add all animations to a dictionary
            //this.animations = clips

            //const clip = this.actions['idle']
            //const action = this.mixer.clipAction(clip)
            //action.play()
            //make sure to do action.stop before playing another animation
            this.loaded = true
        })
    }

    setPhysics() {
        this.physicsObject = new PhysicsObject(this.geometry, this.shape)
        this.physicsObject.setmesh(this.mesh)
        this.physicsObject.instantiateAtPos(
            this.scene,
            this.cannon,
            this.position
        )
        this.mesh.layers.enable(3)
    }

    setColor(inputColor) {
        this.mesh.material = new THREE.MeshPhongMaterial({ color: inputColor })
    }

    remove() {
        this.mesh.removeFromParent()
        if (this.physicsObject) {
            this.cannon.removeBody(this.physicsObject)
        }
    }

    update(delta) {
        if (this.mixer) this.mixer.update(delta)
    }

    interact(robot) {}
}
