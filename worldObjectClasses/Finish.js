import { WorldObject } from './worldObject.js'
import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'

import { Level_1 } from '../WorldData.js'

//to be implemented
export class Finish extends WorldObject {
    constructor(scene, cannon, position, level) {
        super(scene, cannon, position)
        this.robots_till_win = 3
        this.setColor(0xffffff)
        this.level = level
    }
    interact(robot) {
        //replace with a jumpscare or something idk anymore
        //alert('you won')

        if (!robot.alive) {
            return
        }
        robot.remove()

        this.robots_till_win = this.robots_till_win - 1
        console.log(this.robots_till_win)
        if (this.robots_till_win == 0) {
            //alert('brace make me a sandwich')
            //window.location.reload()
            this.level.loadNewLevel(Level_1)
        }
    }
}
