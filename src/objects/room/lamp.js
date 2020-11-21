import * as Three from 'three';
import materials from '../../components/materials.js'
let lamp = {
    create: function() {
        let lampGroup = new Three.Group();
        
        let lampFrame = new Three.CylinderBufferGeometry(0.2,0.5,0.7,20);
        let lampMesh = new Three.Mesh(lampFrame,materials.matWhite);
        lampMesh.position.z = -47 + lampFrame.parameters.radiusTop;
        lampMesh.position.x = -1;
        lampMesh.position.y = 6;
        lampGroup.add(lampMesh);
        //bedMesh.material.opacity *= 0.01

        let lampStand = new Three.CylinderBufferGeometry(0.02,0.02,3.5,20);
        let lampStandMesh = new Three.Mesh(lampStand,materials.wood);
        lampStandMesh.position.z = -47 + lampFrame.parameters.radiusTop + lampStand.parameters.radiusTop;
        lampStandMesh.position.x = -1;
        lampStandMesh.position.y = 4.2;
        lampGroup.add(lampStandMesh);

        let lampBase = new Three.CylinderBufferGeometry(0.5,0.5,0.1,20);
        let lampBaseMesh = new Three.Mesh(lampBase,materials.wood);
        lampBaseMesh.position.z = -47 + lampBase.parameters.radiusTop/2; 
        lampBaseMesh.position.x = -1;
        lampBaseMesh.position.y = 2.55;
        lampGroup.add(lampBaseMesh);

        return lampGroup
    }
} 
export default lamp;
