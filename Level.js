import * as THREE from 'three'
import { GLTFLoader } from './lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'
import {WorldObject} from `./worldObjectClasses/worldObject.js`

export class Cursor {
    //using code I stole from the actor class
    constructor(scene, cannon_world, level_data) {
        //iterate through the selected levels data
        this.level_objects = []
        for (let i = 0; i < level_data.length; i++) {
            const row = level_data[i]
            //create new objects and place into array
            const object_row = []
            for (let j = 0; j < row.length; j++) {
                const element = row[j]
                //read then create new object depending on level data
                let world_object

                object_row.push(world_object)
            }
            //place into level objects
            this.level_objects.push(object_row)
        }
    }

    // OBJECT ID NUMBERS
    // 0 = empty space
    // 10 robotSpawner (5 robots)
    // 20 platform
    // 30 border
    // 40 crusher up/down
    // 41 crusher left/right
    // to be filled out

    
    getNewObject(object_id) { //returns a new object of the corisponding id
        let world_object
        switch (object_id) {
            case 0: //air
                world_object = null
                break
            case 10 : //spawner
                world_object = null
                break
            case 10 : //spawner
                world_object = null
                break
            default:
                break
        }
    }

    update(delta) {}
}
