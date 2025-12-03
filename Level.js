import * as THREE from 'three'
import { GLTFLoader } from './lib/addons/GLTFLoader.js'
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'

export class Cursor {
    //using code I stole from the actor class
    constructor(scene, cannon_world, level_data) {
        this.level_objects = []
    }

    update(delta) {}
}
