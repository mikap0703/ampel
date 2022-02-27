import * as THREE from 'three';
import Ampel from './ampel';

class Junction {
    constructor() {
        this.street0 = new Street(5, 0);
        this.street1 = new Street(5, 1);
        this.street2 = new Street(5, 2);
        this.street3 = new Street(5, 3);
        this.gruenPhase = 5;
        this.phase = 1;
        this.control();
    }

    build() {
        var group = new THREE.Group();
        group.add(this.street0.build(), this.street1.build(), this.street2.build(), this.street3.build());
        return group;
    }

    control() {
        this.i = 0;
        this.delayFaktor = 1;

        setTimeout(this.foo.bind(this), 1000 * this.delayFaktor)
    }

    foo() {
        if (this.i % 4== 0) {
            this.delayFaktor = this.gruenPhase;
        } else {
            this.delayFaktor = this.phase;
        };
        this.setLightStatus(this.i)
        this.i++;
        setTimeout(this.foo.bind(this), 1000 * this.delayFaktor)
    }

    setLightStatus(i) {
        let offset = 4;
        // 2 groups in which the ampels are controlled equally
        let ampelStatusG1 = i % 8;
        let ampelStatusG2 = (i + offset) % 8;
        this.street0.ampel.setStatus(ampelStatusG1);
        this.street2.ampel.setStatus(ampelStatusG1);
        this.street1.ampel.setStatus(ampelStatusG2);
        this.street3.ampel.setStatus(ampelStatusG2);
    }

}
class Street {
    constructor(width, heading) {
        this.width = width;
        this.heading = heading;
        this.ampel = new Ampel();
    }

    build() {
        var group = new THREE.Group();
        var street = new THREE.Group();

        var streetLength = 20;
        var geo = new THREE.CylinderGeometry(0.05, 0.05, streetLength, 8);
        var mat = new THREE.MeshBasicMaterial({color: 0xffffff});

        var leftBorder = new THREE.Mesh(geo, mat);
        leftBorder.position.x = this.width;

        var rightBorder = new THREE.Mesh(geo, mat);
        rightBorder.position.x = - this.width;

        street.add(leftBorder);
        street.add(rightBorder);

        street.rotateX(0.5 * Math.PI);
        group.add(street);

        var streetAmpel = this.ampel.build();

        streetAmpel.position.x = this.width + 2;
        streetAmpel.position.z = (- 0.5 * streetLength) + 2;
        group.add(streetAmpel)

        switch (this.heading) {
            case 0:
                group.position.z = (streetLength * 0.5) + this.width;
                break;
            case 1:
                group.position.x = (streetLength * 0.5) + this.width;
                break;
            case 2:
                group.position.z = -1 * ((streetLength * 0.5) + this.width);
                break;
            case 3:
                group.position.x = -1 * ((streetLength * 0.5) + this.width);
                break;
            default:
                break;
        }

        group.rotateY(this.heading * 0.5 * Math.PI)

        return(group)
    }
}

export { Street, Junction }