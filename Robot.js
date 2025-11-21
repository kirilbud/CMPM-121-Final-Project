import * as THREE from 'three';
import { GLTFLoader } from './lib/addons/GLTFLoader.js';

export class Robot {
    constructor(scene, position){
        const scale = .6;

        //robot variables
        this.up = new THREE.Vector3(0,1,0);
        this.forward = new THREE.Vector3(1,0,0); //the direction the bot is walking
        this.speed = 1;
        this.animations = null; //this holds the animations of the bot
        this.mixer; //animation mixer for the bot
        this.bot; //the robots mesh

        this.actions = {}; //dictionary for actions for easy stop start



        const gltfLoader = new GLTFLoader();
        let url = "./glb/UV_the_robot.glb";
        gltfLoader.load(url, (gltf) => {

            const root = gltf.scene;
            root.scale.set(scale, scale, scale);
            root.position.set(position);
            scene.add(root);


            this.mixer = new THREE.AnimationMixer(root);
            this.bot = root;

            console.log(this.bot)
            const clips = gltf.animations;

            //add all animations to a dictionary
            this.animations = clips;

            this.clips["Run"] = THREE.AnimationClip.findByName(clips, 'Run');//find the run animation
            this.clips["Fall"] = THREE.AnimationClip.findByName(clips, 'Fall');//find the fall animation
            this.clips["Idle"] = THREE.AnimationClip.findByName(clips, 'Idle');//find the fall animation


            const clip = this.clips["Run"]; 
            const action = this.mixer.clipAction(clip);
            action.play();
            //make sure to do action.stop before playing another animation
        });
    }

    Update() {

    }
}