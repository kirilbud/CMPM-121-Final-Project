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
        this.position = position

        const camera = scene.getObjectsByProperty('isCamera', true)[0]

        this.focus_point = camera.parent
    }

    setMeshURL(url) {
        const gltfLoader = new GLTFLoader()
        //let url = `./glb/Cursor.glb`

        this.resetMesh()

        if (url != null) {
            gltfLoader.load(url, (gltf) => {
                const root = gltf.scene
                root.scale.set(0.5, 0.5, 0.5)
                root.position.set(this.position)
                this.scene.add(root)

                this.mesh = root
            })
        }
    }

    resetMesh() {
        this.scene.remove(this.mesh)
        this.mesh = undefined
    }

    setMeshFromID(id) {
        if (id == 0) {
            this.setMeshURL(null)
        }
        else if (id == 30) {
            this.setMeshURL('./glb/PLatform.glb')
        }
        else if ( id == 60 ) {
            this.setMeshURL('./glb/Spring.glb')
        }
    }

    setPosition(x, y) {
        let newx = Math.floor((x - 0.5) * X_SENS)
        let newy = Math.floor((y - 0.5) * y_SENS)
        if (this.mesh) {
            this.mesh.position.set(0, -newy, newx)
        }
    }

    getPosition() {
        const target = new THREE.Vector3(0,0,0)
        this.mesh.getWorldPosition(target)
        
        let newx = Math.floor((target.z - 0.5) + 1)
        let newy = Math.floor((target.y - 0.5) + 1)

        return new THREE.Vector2(newx,newy)
    }

    update(delta) {}
}
