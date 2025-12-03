import { WorldObject } from './worldObject.js'
import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'
import { Robot } from '../Robot.js'

//to be implemented
export class RobotSpawner extends WorldObject {
    constructor(scene, cannon, position) {
        super(scene, cannon, position)
        this.setColor(0x9c59d1)
        this.robot_array = []
    }
    update(delta) {
        super.update(delta)
    }
}
