import { WorldObject } from './worldObject.js'
import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'

//to be implemented
export class Spring extends WorldObject {
    constructor(scene, cannon, position) {
        super(scene, cannon, position)
        this.setColor(0x5bcefa)
        this.setgltf('./glb/Spawnbox.glb')
    }

    interact(robot) {
        //console.log('bounce')
        const robot_body = robot.getBody()
        //console.log(robot_body.velocity.y)
        if (robot_body.velocity.y < 0.01) {
            robot_body.applyImpulse(new CANNON.Vec3(0, 15, 0), robot.position)
        }
        //robot_body.applyImpulse(new CANNON.Vec3(0, 1, 0), robot.position)
    }
    update(delta) {
        super(delta)
    }
}
