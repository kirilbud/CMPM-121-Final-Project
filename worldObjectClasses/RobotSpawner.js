import { WorldObject } from './worldObject.js'
import * as THREE from 'three'
import { GLTFLoader } from '../lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import { PhysicsObject } from './PhysicsObject.js'
import { Robot } from '../Robot.js'

//to be implemented
export class RobotSpawner extends WorldObject {
    constructor(scene, cannon, position, robot_array, amount) {
        super(scene, cannon, position)
        this.toatal_robots = amount
        this.robots_to_spawn = this.toatal_robots
        this.robot_spawn_timer = 0

        this.setColor(0x9c59d1)
        this.setgltf('./glb/Spawnbox.glb')

        this.robot_array = robot_array
    }
    update(delta) {
        super.update(delta)
        //spawn robots if on cool down and there is still robots to spawn
        this.robot_spawn_timer = this.robot_spawn_timer - delta
        if (this.robot_spawn_timer <= 0 && this.robots_to_spawn != 0) {
            this.robot_spawn_timer = 2
            this.robots_to_spawn = this.robots_to_spawn - 1
            this.robot_array.push(
                new Robot(this.scene, this.cannon, this.position)
            )
        }
    }
}
