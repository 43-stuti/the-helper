import * as Three from 'three';
import materials from '../../components/materials.js'
let room = {
    create: function() {
        let roomGroup = new Three.Group();
        let floor = new Three.BoxBufferGeometry(8,0.1,13);
        let floorMesh = new Three.Mesh(floor,materials.silver);
        floorMesh.position.z = -42;
        floorMesh.position.x = 2;
        floorMesh.position.y = 2.5;
        roomGroup.add(floorMesh);

        let backwall = new Three.BoxBufferGeometry(8,6,0.1);
        let backwallMesh = new Three.Mesh(backwall,materials.darkBlue);
        backwallMesh.position.z = -48;
        backwallMesh.position.x = 2;
        backwallMesh.position.y = 5.5;
        roomGroup.add(backwallMesh);
        //right wall
        let sideWall = new Three.BoxBufferGeometry(0.1,6,13);
        let sideWallMesh = new Three.Mesh(sideWall,materials.darkBlue);
        sideWallMesh.position.z = -42;
        sideWallMesh.position.x = -2;
        sideWallMesh.position.y = 5.5;
        roomGroup.add(sideWallMesh);
        return roomGroup;
    }
}
export default room;