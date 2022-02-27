import * as THREE from 'three';

export default class Ampel{
    constructor(){
        this.lightStatus = [1, 0, 0];
    }

    build() {
        const poleHeight = 3;

        var ampel = new THREE.Group()

        // pole
        ampel.add(this.ampelPole(poleHeight))

        // box
        var box = this.ampelBox(0.4, 0.4, 2)
        box.position.y = poleHeight;
        ampel.add(box)

        return ampel
    }

    ampelBox(r, d, h) {
        var box = new THREE.Group();
        var ampelCase = new THREE.Group();

        var mat = new THREE.MeshBasicMaterial({color: 0x000000});

        var boxRadius = r;
        var boxDepth = d;
        var boxHeight = h - (2 * r);
        var cylinderGeo = new THREE.CylinderGeometry(boxRadius, boxRadius, boxDepth, 16) //(boxRadius, boxRadius, boxHeight, 16);

        var lowerPart = new THREE.Mesh(cylinderGeo, mat);
        var upperPart = new THREE.Mesh(cylinderGeo, mat);

        lowerPart.rotateX(Math.PI * 0.5);
        upperPart.rotateX(Math.PI * 0.5);

        upperPart.position.y = boxHeight;

        var mainPartGeo = new THREE.BoxGeometry(2 * boxRadius, boxHeight, boxDepth);
        var mainPart = new THREE.Mesh(mainPartGeo, mat);

        mainPart.position.y = boxHeight * 0.5;

        ampelCase.add(lowerPart);
        ampelCase.add(upperPart);
        ampelCase.add(mainPart);
        
        ampelCase.position.y = boxRadius;

        box.add(ampelCase)

        var lights = new THREE.Group();

        var lightRadius = r - 0.2;
        this.redLight = new Light(lightRadius, "red");
        this.yellowLight = new Light(lightRadius, "yellow");
        this.greenLight = new Light(lightRadius, "green");
        var lightMargin = (h - 6 * lightRadius) / 4;

        var redLight = this.redLight.build();
        redLight.position.y = (5 * lightRadius) + (3 * lightMargin);        
        var yellowLight = this.yellowLight.build();
        yellowLight.position.y = (3 * lightRadius) + (2 * lightMargin);
        var greenLight = this.greenLight.build();
        greenLight.position.y = lightRadius + lightMargin;

        lights.add(redLight, yellowLight, greenLight)

        lights.position.z = 0.5 * boxDepth;

        box.add(lights);

        return(box)
    }

    setStatus(s) { // s in [0; 7]
        switch (s) {
            case 0:
                this.lightStatus = [0, 0, 1];
                break;
            case 1:
                this.lightStatus = [0, 1, 0];
                break;
            case 7:
                this.lightStatus = [1, 1, 0];
                break;
            default:
                this.lightStatus = [1, 0, 0];
                break;
        }

        this.redLight.setLightStatus(this.lightStatus[0])
        this.yellowLight.setLightStatus(this.lightStatus[1])
        this.greenLight.setLightStatus(this.lightStatus[2])
        //console.log(this.lightStatus)
        return(1)
    }

    ampelPole(h) {
        var geo = new THREE.CylinderGeometry(0.1, 0.1, h, 16);
        var mat = new THREE.MeshBasicMaterial({color: 0xffff00});
        var cylinder = new THREE.Mesh(geo, mat);
        cylinder.position.y = cylinder.geometry.parameters.height * 1/2;

        return cylinder
    }
}

class Light {
    constructor(r, c) {
        this.c = c;
        this.r = r;
    }

    build() {
        var geo = new THREE.CylinderGeometry(this.r, this.r, 0.2, 16);

        this.mat = new THREE.MeshBasicMaterial({color: 0x000000});
        this.lightMesh = new THREE.Mesh(geo, this.mat);
        this.lightMesh.rotateX(0.5 * Math.PI)
        //lightMesh.layers.enable(1);

        return this.lightMesh
    }

    setLightStatus(s) {
        var color;
        if (s == 1) {
            //console.log("AN")
            //console.log(this.c)
            switch (this.c) {
                case "red":
                    color = 0xf51b1b;
                    break;
                case "yellow":
                    color = 0xf5ee1b;
                    break;
                case "green":
                    color = 0x2df51b;
                    break;
            
                default:
                    color = 0x000000;
                    break;
            }
        }
        else {
            //console.log("AUS")
            color = 0x000000;
        }

        this.mat.color.setHex(color);
    }
}