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
//import { Level_1 } from './WorldData.js'
import { gameMenu } from './WorldData.js'
import { gameText } from './languages.js'
import { EndScreen } from './EndScreen.js'

import { Level_1 } from './WorldData.js'
import { Level_2 } from './WorldData.js'
import { Level_3 } from './WorldData.js'
import { Level_4 } from './WorldData.js'
import { Level_5 } from './WorldData.js'

import { uiDiv } from './Game.js'

const ItemSetEvent = new Event('itemSet')

export class Level {
    //using code I stole from the actor class
    constructor(g_scene, cannon_world, level_data, inventory) {
        this.level_order = [Level_1, Level_2, Level_3, Level_4]
        this.level_platforms = [3, 3, 4, 5]
        this.level_springs = [1, 1, 3, 0]
        this.deaths_till_reset = 0
        this.robots = []
        this.level_number = 0

        this.inventory = inventory

        this.max_platforms = inventory[1].getCount()
        this.max_springs = inventory[2].getCount()

        this.g_scene = g_scene
        this.cannon_world = cannon_world
        this.scene = new THREE.Scene()

        this.g_scene.add(this.scene)
        //iterate through the selected levels data
        this.level_objects = []
        //check if save data exists
        if (localStorage.getItem('save')) {
            console.log('save found')
            this.loadSave()
        } else {
            console.log('no save found')
            this.loadNewLevel(level_data)
            this.current_level = level_data
        }
    }

    loadSave() {
        const save = JSON.parse(localStorage.getItem('save'))
        const level_number = save.level
        this.level_number = level_number
        for (let i = 0; i < level_number; i++) {
            this.current_level = this.level_order.shift()
            this.level_platforms.shift()
            this.inventory[2].getCount() + this.level_springs.shift()
        }

        this.max_platforms = save.platforms
        console.log(`platforms = ${this.max_platforms}`)
        this.max_springs = save.springs
        uiDiv.dispatchEvent(ItemSetEvent)
        this.loadNewLevel(this.current_level)
    }

    save() {
        const save = {
            level: this.level_number,
            platforms: this.max_platforms,
            springs: this.max_springs,
        }
        localStorage.setItem('save', JSON.stringify(save))
    }

    loadNewLevel(level_data) {
        //clear level information

        this.unloadLevel()
        console.log('loading level')
        console.log(`laoding platforms = ${this.max_platforms}`)
        this.inventory[1].setCount(this.max_platforms)
        this.inventory[2].setCount(this.max_springs)
        this.deaths_till_reset = 0

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
        //(this.g_scene)

        if (level_data == gameMenu) {
            const langData = gameText['Hebrew']

            const geometry = new THREE.BoxGeometry(1, 1, 0.1)

            const material = new THREE.MeshBasicMaterial({
                color: 0x663399,
                side: THREE.DoubleSide,
            })
            /*
            const playButton = new THREE.Mesh(geometry, material)
            playButton.rotation.x = Math.PI
            playButton.rotation.y += 1.6

            const englishButton = new THREE.Mesh(geometry, material)
            englishButton.rotation.x = Math.PI
            englishButton.rotation.y += 1.6

            const chineseButton = new THREE.Mesh(geometry, material)
            chineseButton.rotation.x = Math.PI
            chineseButton.rotation.y += 1.6

            const hebrewButton = new THREE.Mesh(geometry, material)
            hebrewButton.rotation.x = Math.PI
            hebrewButton.rotation.y += 1.6

            this.g_scene.add(playButton)
            this.g_scene.add(englishButton)
            this.g_scene.add(chineseButton)
            this.g_scene.add(hebrewButton)

            playButton.position.set(4, -12, 5)
            englishButton.position.set(3, -4.3, 22)
            chineseButton.position.set(3, -6.3, 22)
            hebrewButton.position.set(3, -8.3, 22)
            */
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
            /*
            const gameTitle = createTextSprite(langData.gameTitle)
            const playText = createTextSprite(langData.playText)
            const englishText = createTextSprite('English')
            const chineseText = createTextSprite('Chinese')
            const hebrewText = createTextSprite('Hebrew')

            gameTitle.position.set(-2, -4, 9)
            playText.position.set(0, -12, 12)
            englishText.position.set(3, -5, 25)
            chineseText.position.set(3, -7, 25)
            hebrewText.position.set(3, -9, 25)

            englishText.scale.set(4, 3, 5)
            chineseText.scale.set(4, 3, 5)
            hebrewText.scale.set(4, 3, 5)
            
            this.g_scene.add(playText)
            this.g_scene.add(gameTitle)
            this.g_scene.add(englishText)
            this.g_scene.add(chineseText)
            this.g_scene.add(hebrewText)
            */
        }
    }

    unloadLevel() {
        console.log('unloading')
        for (let i = 0; i < this.level_objects.length; i++) {
            const row = this.level_objects[i]

            for (let j = 0; j < row.length; j++) {
                const object = row[j]
                if (object) {
                    object.remove()
                }
            }
        }

        for (const robot of this.robots) {
            robot.remove()
        }
        this.robots = []
        this.deaths_till_reset = 0
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
                this.deaths_till_reset += 3
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
                    1,
                    this
                )
                break
            case 41: // crusher left / right
                world_object = new Crusher(
                    this.scene,
                    this.cannon_world,
                    position,
                    2,
                    this
                )
                break
            case 50: // finish object
                world_object = new Finish(
                    this.scene,
                    this.cannon_world,
                    position,
                    this
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
        let robots_dead = 0
        for (const robot of this.robots) {
            robot.update(delta)
            if (!robot.alive) {
                robots_dead = robots_dead + 1
            }
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

        if (this.deaths_till_reset < 1) {
            this.reloadLevel()
        }
    }

    getObject(x, y) {
        return this.level_objects[-y][x]
    }

    removeObject(x, y) {
        const object = this.getObject(x, y)
        if (object) {
            object.remove()
            this.level_objects[-y][x] = undefined
        }
    }

    getGridPosition(position) {
        return new THREE.Vector3(
            0,
            Math.floor(position.y - 0.5),
            Math.floor(position.x + 0.5)
        )
    }

    placeObject(x, y, object_id) {
        this.removeObject(x, y)
        const object_position = new THREE.Vector3(0, y, x)
        const object_to_add = this.getNewObject(object_id, object_position)
        this.level_objects[-y][x] = object_to_add
    }

    LoadNextLevel() {
        if (this.level_order.length == 0) {
            //finish
            this.deaths_till_reset = 100
            this.unloadLevel()
            this.deaths_till_reset = 100
            new EndScreen(this.g_scene)
            return
        }

        const level_to_load = this.level_order.shift()
        this.current_level = level_to_load

        this.max_platforms =
            this.inventory[1].getCount() + this.level_platforms.shift()
        this.max_springs =
            this.inventory[2].getCount() + this.level_springs.shift()

        this.loadNewLevel(level_to_load)
        this.level_number = this.level_number + 1
        this.save()
    }

    reloadLevel() {
        console.log('reloading')
        this.loadNewLevel(this.current_level)
    }

    getLevelCenter() {
        //index for worldObject in bottom right corner
        const idx = new THREE.Vector2(
            this.level_objects[0].length - 1,
            this.level_objects.length - 1
        )
        const corner = this.level_objects[idx.y][idx.x]
        let cornerPos = new THREE.Vector3(0, 0, 0)

        corner.mesh.getWorldPosition(cornerPos)

        const centerPos = new THREE.Vector3(
            0,
            Math.floor(cornerPos.y / 2),
            cornerPos.z / 2
        )(centerPos)

        return centerPos
    }
}
