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

export class Menu {
    constructor(g_scene, cannon_world) {
        this.g_scene = g_scene
        this.cannon_world = cannon_world

        this.g_scene.add(this.scene)
    }
}
