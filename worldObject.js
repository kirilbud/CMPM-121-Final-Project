import * as THREE from 'three';
import {GLTFLoader} from './lib/addons/GLTFLoader.js';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';

export class WorldObject {
    constructor(scene, cannon, position){
        this.shape = new CANNON.Box(new CANNON.Vec3(1,1,1))
        this.geometry = new THREE.BoxGeometry(1,1,1)
    }

    //to be implemented
    setgltf(url){
        gltfLoader.load(url, (gltf) => {

            const root = gltf.scene;
            root.scale.set(scale, scale, scale);
            root.position.set(position);
            scene.add(root);


            this.mixer = new THREE.AnimationMixer(root);
            this.bot = root;


            const clips = gltf.animations;


            //add all animations to a dictionary
            this.animations = clips;


            const clip = this.actions["idle"]; 
            const action = this.mixer.clipAction(clip);
            action.play();
            //make sure to do action.stop before playing another animation
            
        });
    }

    update(delta) {
        
    }
}