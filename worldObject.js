import * as THREE from 'three';
import {GLTFLoader} from './lib/addons/GLTFLoader.js';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';

export class worldObject {
    constructor(scene, position){
        this.shape = new CANNON.Box(new CANNON.Vec3(1,1,1))
        this.geometry = new THREE.BoxGeometry(1,1,1)
    }

    Update() {
            
    }
}