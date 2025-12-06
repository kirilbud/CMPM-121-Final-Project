import { WorldObject } from './worldObject.js'
import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'

//to be implemented
export class Crusher extends WorldObject {
    constructor(scene, cannon, position, varient, level) {
        super(scene, cannon, position)
        this.level = level
        this.setColor(0xff0000)

        this.varient = varient

        this.setgltf('./glb/Crusher.glb')
    }
    update(delta) {
        super.update(delta)

        if (this.loaded) {
            this.loaded = false
            switch (this.varient) {
                case 1:
                    //up down
                    //nothing needed
                    break
                default:
                    //left right
                    this.mesh.rotateX(Math.PI)
                    break
            }
            let clip = THREE.AnimationClip.findByName(this.clips, 'Idle')
            const action = this.mixer.clipAction(clip)
            action.play()
        }
    }

    interact(robot) {
        if (!robot.alive) {
            return
        }
        robot.remove()
        this.level.deaths_till_reset = this.level.deaths_till_reset - 1
    }
}
