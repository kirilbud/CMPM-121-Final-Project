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
        this.setgltf('./glb/Spring.glb')
    }

    interact(robot) {
        const robot_body = robot.getBody()
        if (robot_body.velocity.y < 0.0001) {
            robot_body.applyImpulse(new CANNON.Vec3(0, 7, 0), robot.position)
        }
        let clip = THREE.AnimationClip.findByName(this.clips, 'active')
        const action = this.mixer.clipAction(clip)
        action.setLoop(THREE.LoopOnce, 1)
        action.clampWhenFinished = true
        action.reset()
        action.play()
        //action.stop()
    }
    update(delta) {
        super.update(delta)
    }
}
