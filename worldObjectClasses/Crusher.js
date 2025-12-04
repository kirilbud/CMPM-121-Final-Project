import { WorldObject } from './worldObject.js'
import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'

//to be implemented
export class Crusher extends WorldObject {
    constructor(scene, cannon, position, varient) {
        super(scene, cannon, position)

        this.setColor(0xff0000)

        switch (varient) {
            case 1:
                //up down
                break
            default:
                //left right
                break
        }
    }
}
