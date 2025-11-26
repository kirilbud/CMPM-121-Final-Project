import * as THREE from 'three';
import {GLTFLoader} from './lib/addons/GLTFLoader.js';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';


export class PhysicsObject {
    constructor(inputGeometry, inputShape) {
        this.geometry = inputGeometry;
        this.material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        this.mesh = new THREE.Mesh(this.geometry,this.material);
        this.layers = this.mesh.layers
        this.bodyShape = inputShape;
        this.body = new CANNON.Body({ shape: this.bodyShape })
    }
    setMass(massInput) {
        this.body.mass = massInput
        if (massInput <= 0) {
            this.body.type = CANNON.Body.STATIC
        }
        else {
            this.body.type = CANNON.Body.DYNAMIC
        }
        this.body.updateMassProperties()
    }
    setColor(inputColor) {
        this.material.color = inputColor
    }
    instantiate(inputScene, inputWorld) {
        inputScene.add(this.mesh)
        inputWorld.addBody(this.body)

        self.addEventListener("physicsStep", () => {
            //console.log(this.mesh.position.y + " - " + this.body.position.y)
            if (this.body.position) {
                this.mesh.position.copy(this.body.position)
                this.mesh.quaternion.copy(this.body.quaternion)
            }
        })
    }
    instantiateAtPos(inputScene, inputWorld, position) {
        if (typeof(position == CANNON.Vec3)) {
            this.instantiate(inputScene,inputWorld)
            this.body.position.copy(position)
        }
    }
    
}