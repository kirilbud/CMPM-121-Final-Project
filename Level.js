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
import { Star } from './worldObjectClasses/Star.js'

import { Robot } from './Robot.js'
import { Level_1 } from './WorldData.js'
import { gameMenu } from './WorldData.js'

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

        if (level_data == gameMenu) {
            function createTextSprite(message) {
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                context.font = 'Bold 60px Arial'
                context.fillStyle = 'rgba(255, 255, 255, 1.0)' // Change the color of the game title
                context.fillText(message, 0, 60) // Draw the text

                const texture = new THREE.CanvasTexture(canvas)
                // Setting needsUpdate to true ensures the texture is updated
                texture.needsUpdate = true

                const material = new THREE.SpriteMaterial({ map: texture })
                const sprite = new THREE.Sprite(material)
                sprite.scale.set(10, 5, 5)
                return sprite
            }

            const gameTitle = createTextSprite('Automaton')
            const playButton = createTextSprite('Play')
            const questionButton = createTextSprite('?')

            gameTitle.position.set(-2, -4, 9)
            playButton.position.set(0, -12, 12)
            questionButton.position.set(0, -12, 25)

            this.g_scene.add(playButton)
            this.g_scene.add(gameTitle)
            this.g_scene.add(questionButton)
        }
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
                    this.robots,
                    5
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
                    this.scene,
                    this.cannon_world,
                    position,
                    1
                )
                break
            case 41: // crusher left / right
                world_object = new Crusher(
                    this.scene,
                    this.cannon_world,
                    position,
                    2
                )
            case 50: // finish object
                world_object = new Finish(
                    this.scene,
                    this.cannon_world,
                    position
                )
                break
            case 60:
                world_object = new Spring(
                    this.scene,
                    this.cannon_world,
                    position
                )
                break
            case 70:
                world_object = new Star(this.scene, this.cannon_world, position)
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

            const robot_grid_position = robot.getGridPosition()

            if (
                robot_grid_position === undefined ||
                robot_grid_position.x <= 0 ||
                robot_grid_position.y <= 0
            ) {
                continue
            }
            const current_level_object =
                this.level_objects[robot_grid_position.y][robot_grid_position.x]
            if (current_level_object) {
                current_level_object.interact(robot)
            }
        }
    }

    getObject(x, y) {
        return this.level_objects[y][x]
    }

    removeObject(x, y) {
        const obeject = this.getObject(x, y)
        if (obeject) {
            obeject.remove()
        }
    }

    getGridPosition(position) {
        if (this.bot === undefined) {
            return
        }
        return new THREE.Vector2(
            Math.floor(position.z + 0.5),
            Math.floor(position.y - 0.5)
        )
    }

    placeObject(x, y, object_id) {
        this.removeObject(x, y)
        const object_position = new THREE.Vector3(0, -y, x)
        const object_to_add = this.getNewObject(object_id, object_position)
        this.level_objects[y][x] = object_to_add
    }
}
