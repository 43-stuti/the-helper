import * as Three from 'three';
import materials from '../../components/materials.js'
let bed = {
    create: function() {
        let bedGroup = new Three.Group();
        
        let bedFrame = new Three.BoxBufferGeometry(2,0.5,7);
        let bedMesh = new Three.Mesh(bedFrame,materials.wood);
        bedMesh.position.z = -47 + bedFrame.parameters.depth/2;
        bedMesh.position.x = 3;
        bedMesh.position.y = 2.6 + bedFrame.parameters.height/2;
        //bedMesh.material.opacity *= 0.01
        bedGroup.add(bedMesh)
        
        let headRest = new Three.BoxBufferGeometry(2,1,0.1);
        let headRestMesh = new Three.Mesh(headRest,materials.wood);
        headRestMesh.position.x = bedMesh.position.x;
        headRestMesh.position.y = 2.6 + bedFrame.parameters.height + headRest.parameters.height/2;
        headRestMesh.position.z = -47 + headRest.parameters.depth/2;
        bedGroup.add(headRestMesh);
        
        let mattressBase = new Three.BoxBufferGeometry(2,0.2,6.9);
        let mattressBaseMesh = new Three.Mesh(mattressBase,materials.lightBlue);
        mattressBaseMesh.position.z = -47 + headRest.parameters.depth + mattressBase.parameters.depth/2;
        mattressBaseMesh.position.x = 3;
        mattressBaseMesh.position.y = 2.6 + bedFrame.parameters.height + mattressBase.parameters.height/2;
        mattressBaseMesh.receiveShadow = true
        bedGroup.add(mattressBaseMesh)
    
        let mattress = new Three.DodecahedronBufferGeometry(1,0);
        let mattressMesh = new Three.Mesh(mattress,materials.lightBlue);
        mattressMesh.scale.y = 0.08;
        mattressMesh.scale.x = 1.1;
        mattressMesh.scale.z = 2;
        mattressMesh.position.z = -38;
        mattressMesh.position.x = 3;
        mattressMesh.position.y = 3.45;
        //bedGroup.add(mattressMesh)
        //mattressMesh.rotation.y = Math.PI/3;
    
        //ADD PILLOWS
        let pillow = new Three.DodecahedronBufferGeometry(0.5,0);
        let pillowMesh = new Three.Mesh(pillow,materials.darkBlue);
        //pillowMesh.scale.x = 1.2;
        pillowMesh.scale.y = 0.5;
        pillowMesh.position.z = -47 + headRest.parameters.depth + 0.5/2;
        pillowMesh.position.x = 2.5;
        pillowMesh.position.y = 3.5;
        pillowMesh.castShadow = true;
        bedGroup.add(pillowMesh);
    
        let secondPillow = pillowMesh.clone();
        secondPillow.position.x = 3.5;
        bedGroup.add(secondPillow);
        return bedGroup
    }
} 
export default bed;
