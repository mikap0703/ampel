import * as THREE from 'three';
import Ampel from './ampel';
import { GUI } from 'dat.gui';
import { Street, Junction } from './MapTiles';

export default class Map{
    generate() {
        var world = new THREE.Group()

        var floor = this.generateFloor(30);
    
        world.add(floor);
    
        const pLight = new THREE.DirectionalLight( 0xffff00, 1, 100 );
        pLight.position.set( 10, 10, 10 );
        pLight.castShadow = true;
        world.add(pLight);

        this.worldJunction = new Junction();
        world.add(this.worldJunction.build());

        const gui = new GUI({name: "Einstellung der Zeiten", width: 500});
        var zeitFolder = gui.addFolder("Zeiten");
        zeitFolder.add(this.worldJunction, "gruenPhase", 0, 20, 1).name("Dauer der Grün-Phase");
        zeitFolder.add(this.worldJunction, "phase", 0, 10, 1).name("Dauer für sonstige Phasen");
        zeitFolder.open();

        return world;
    }

    generateFloor(r) {
        var geo = new THREE.CircleGeometry(r, 48);
        var mat = new THREE.MeshPhongMaterial({
            color: 'rgb(92, 192, 92)',
            side: THREE.DoubleSide
        })
    
        var mesh = new THREE.Mesh(geo, mat);
        mesh.receiveShadow = true;
        mesh.name = "floor"
        mesh.rotation.x = Math.PI * 0.5;
    
        return mesh;
    }
}