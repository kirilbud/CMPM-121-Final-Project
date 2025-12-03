import * as THREE from 'three'
import { GLTFLoader } from './lib/addons/GLTFLoader.js'

//little pen that follows the cursor
export class Cursor {
    //using code I stole from the actor class
    constructor(scene, cannon_world, position) {
        let url = ``
        gltfLoader.load(url, (gltf) => {
            const root = gltf.scene
            root.scale.set(scale, scale, scale)
            root.position.set(position)
            scene.add(root)

            this.mixer = new THREE.AnimationMixer(root)
            this.bot = root

            const clips = gltf.animations

            //add all animations to a dictionary
            this.animations = clips

            const clip = THREE.AnimationClip.findByName(clips, 'Idle')
            const action = this.mixer.clipAction(clip)
            action.play()
            //make sure to do action.stop before playing another animation
        })
    }

    update(delta) {}
}
