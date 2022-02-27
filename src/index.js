import './style/main.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import Map from './components/Map.js';

class BasicWorld{
    constructor() {
        this._Initialize();
        this.scene;
    }

    _Initialize() {
        // Config
        // setting up renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor('rgb(60, 60, 60)')
        document.getElementById("three").appendChild(this.renderer.domElement);

        // setting up camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            500
        );
    
        this.camera.position.x = 30;
        this.camera.position.y = 15;
        this.camera.position.z = 30;

        // setting up orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = 0.45 * Math.PI;
        this.controls.zoomSpeed = 0.5;
        this.controls.panSpeed = 0.5;

        // setting up scene and composer (for effects)
        this.scene = new THREE.Scene();

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        // setting up the final map with streets and traffic lights

        var map = new Map();
        this.scene.add(map.generate()); // adding world to scene
        
        this._Animate();
    }

    _Animate() {
        this.composer.render()
        this.controls.update();
        
        // render loop
        requestAnimationFrame(() => {
            this._Animate();
        });
    }
}

var newWorld = new BasicWorld();
