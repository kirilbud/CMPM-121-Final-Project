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
        this.setColor(0xf5a9b8)
    }
    setColor(inputColor) {
        super.setColor(inputColor)
    }
}
