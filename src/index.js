import './style/main.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

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
            100
        );
    
        this.camera.position.x = 20;
        this.camera.position.y = 15;
        this.camera.position.z = 20;

        // setting up orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxDistance = 40;
        this.controls.maxPolarAngle = 0.45 * Math.PI;
        this.controls.zoomSpeed = 0.5;
        this.controls.panSpeed = 0.1;

        // setting up scene and composer (for effects)
        this.scene = new THREE.Scene();

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

/*        const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
        const bloomLayer = new THREE.Layers();
        bloomLayer.set( BLOOM_SCENE );*/

        //this.composer.addPass(new UnrealBloomPass({x: 1024, y: 1024}, 2.0, 0.0, 0.75));

        // setting up the final map with streets and traffic lights

        //Array(200).fill().forEach(this.scene.add(this.addStar))
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

    addStar() {
        const geometry = new THREE.SphereGeometry(0.25, 24, 24);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);
      
        const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(100));
      
        star.position.set(x, y, z);
        return star;
    }
}

var newWorld = new BasicWorld();
