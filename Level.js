import * as THREE from 'three'
import { GLTFLoader } from './lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'

import { WorldObject } from './worldObjectClasses/worldObject.js'

import { Border } from './worldObjectClasses/Border.js'
import { Crusher } from './worldObjectClasses/Crusher.js'
import { Finish } from './worldObjectClasses/Finish.js'
import { Platform } from './worldObjectClasses/Platform.js'
import { RobotSpawner } from './worldObjectClasses/RobotSpawner.js'
import { Spring } from './worldObjectClasses/Spring.js'

import { Robot } from './Robot.js'
import { Level_1 } from './WorldData.js'

export class Level {
    //using code I stole from the actor class
    constructor(g_scene, cannon_world, level_data) {
        this.robots = []

        this.g_scene = g_scene
        this.cannon_world = cannon_world
        this.scene = new THREE.Scene()

        this.g_scene.add(this.scene)
        //iterate through the selected levels data
        this.level_objects = []
        this.loadNewLevel(level_data)
    }

    loadNewLevel(level_data) {
        //clear level information
        this.unloadLevel()

        this.level_objects = []
        for (let i = 0; i < level_data.length; i++) {
            const row = level_data[i]
            //create new objects and place into array
            const object_row = []
            for (let j = 0; j < row.length; j++) {
                const object_id = row[j]
                //read then create new object depending on level data
                const object_position = new THREE.Vector3(0, -i, j)
                let world_object = this.getNewObject(object_id, object_position)

                object_row.push(world_object)
            }
            //place into level objects
            this.level_objects.push(object_row)
        }
        //this.g_scene.add(this.scene)
        //console.log(this.g_scene)
    }

    unloadLevel() {
        for (let i = 0; i < this.level_objects.length; i++) {
            const row = this.level_objects[i]

            for (let j = 0; j < row.length; j++) {
                const object = row[j]
                if (object) {
                    object.remove()
                }
            }
        }
    }

    // OBJECT ID NUMBERS
    // 0 = empty space
    // 10 robotSpawner (5 robots)
    // 20 platform
    // 30 border
    // 40 crusher up/down
    // 41 crusher left/right
    // 50 finish object
    // 60 spring object
    // to be filled out

    getNewObject(object_id, position) {
        //returns a new object of the corisponding id
        let world_object = null
        switch (object_id) {
            case 0: // air
                world_object = null
                break
            case 10: // robotSpawner (5 robots)
                world_object = new RobotSpawner(
                    this.scene,
                    this.cannon_world,
                    position,
                    this.robots
                )
                break
            case 20: // platform
                world_object = new Platform(
                    this.scene,
                    this.cannon_world,
                    position
                )
                break
            case 30: // border
                world_object = new Border(
                    this.scene,
                    this.cannon_world,
                    position
                )
                break
            case 40: // crusher up / down
                world_object = new Crusher(
                    his.scene,
                    this.cannon_world,
                    position,
                    1
                )
                break
            case 41: // crusher left / right
                world_object = new Crusher(
                    his.scene,
                    this.cannon_world,
                    position,
                    2
                )
            case 50: // finish object
                world_object = new Finish(
                    his.scene,
                    this.cannon_world,
                    position
                )
            case 60:
                world_object = new Spring(
                    this.scene,
                    this.cannon_world,
                    position
                )
                break
        }

        return world_object
    }

    update(delta) {
        //iterate through level objects and call update if it exists
        for (let i = 0; i < this.level_objects.length; i++) {
            const row = this.level_objects[i]

            for (let j = 0; j < row.length; j++) {
                const object = row[j]
                if (object) {
                    object.update(delta)
                }
            }
        }

        //iterate through robots
        for (const robot of this.robots) {
            robot.update(delta)
        }
    }
}
