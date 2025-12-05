import { WorldObject } from './worldObject.js'
import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'

//to be implemented
export class Border extends WorldObject {
    constructor(scene, cannon, position) {
        super(scene, cannon, position)
        super.setPhysics()
        this.set
        this.setColor(0xf5a9b8)
        this.setgltf('./glb/BorderBlock.glb')
    }
    update(delta) {
        //console.log('wahoo')
        super.update(delta)
        if (this.loaded) {
            this.loaded = false
            this.mesh.layers.enable(3)
            console.log(this.mesh)

            this.mesh.traverse(function (object) {
                if (object.isMesh) {
                    object.layers.enable(3)
                }
            })
        }
    }
}
