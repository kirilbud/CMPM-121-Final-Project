import { WorldObject } from './worldObject.js'
import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'

//to be implemented
export class Star extends WorldObject {
    constructor(scene, cannon, position) {
        super(scene, cannon, position)
        //this.setPhysics()
        this.exists = true
        this.setColor(0x5bcefa)
        this.setgltf('./glb/star.glb')
    }
    update(delta) {
        super.update(delta)
        if (this.loaded) {
            ///this.loaded = false
            this.mesh.rotateY(delta * 10)
        }
    }
    interact(robot) {
        if (this.exists) {
        }
    }
}
