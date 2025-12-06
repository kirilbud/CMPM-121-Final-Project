import * as THREE from 'three'
import { GLTFLoader } from './lib/addons/GLTFLoader.js'

const X_SENS = 28
const y_SENS = 14

//little pen that follows the cursor
export class Cursor {
    //using code I stole from the actor class
    constructor(scene, level, position) {
        this.canvas = document.querySelector('#c')

        let temp = this
        this.canvas.addEventListener('mousemove', function (e) {
            //console.log(yeah)
            let x = e.x / this.width
            let y = e.y / this.height
            temp.setPosition(x, y)
        })

        this.level = level
        this.scene = scene
        this.position

        const camera = scene.getObjectsByProperty('isCamera', true)[0]

        this.focus_point = camera.parent

        const gltfLoader = new GLTFLoader()

        let url = `./glb/Cursor.glb`
        gltfLoader.load(url, (gltf) => {
            const root = gltf.scene
            root.scale.set(0.2, 0.2, 0.2)
            root.position.set(position)
            root.rotateY(1.5)
            root.rotateX(2)
            scene.add(root)

            this.mesh = root
        })
    }

    setPosition(x, y) {
        let newx = (x - 0.5) * X_SENS
        let newy = (y - 0.5) * y_SENS
        console.log(this.mesh)
        if (this.mesh) {
            this.mesh.position.set(0, -newy, newx)
        }
    }

    getPosition() {
        const position = this.mesh.getWorldPosition()
        return new THREE.Vector2(position.z, position.y)
    }

    update(delta) {}
}
