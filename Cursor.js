import * as THREE from 'three'
import { GLTFLoader } from './lib/addons/GLTFLoader.js'

//little pen that follows the cursor
export class Cursor {
    //using code I stole from the actor class
    constructor(scene, level, position) {
        this.level = level
        this.scene = scene
        this.position

        const camera = scene.getObjectsByProperty('isCamera', true)[0]

        this.focus_point = camera.parent

        let url = `./glb/Cursor.glb`
        gltfLoader.load(url, (gltf) => {
            const root = gltf.scene
            root.scale.set(scale, scale, scale)
            root.position.set(position)
            scene.add(root)

            this.mesh = root
            //make sure to do action.stop before playing another animation
        })
    }

    setPosition(x, y) {}

    update(delta) {}
}
