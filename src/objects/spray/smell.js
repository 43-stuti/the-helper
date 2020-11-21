import * as Three from 'three';
import materials from '../../components/materials.js'
var smell = {
    createMesh: function() {
        let smokeGroup = new Three.Group();
        smokeGroup.speed = -0.05;
        smokeGroup.lifespan = 200;
        
        let smokeBubble = new Three.SphereBufferGeometry(0.25,32,32);
        let smokeMesh = new Three.Mesh(smokeBubble,materials.darkGrey);
        smokeMesh.position.z = -45;
        smokeMesh.position.x = -2;
        smokeMesh.position.y = Math.random()*(6-4) + 5;
        smokeGroup.add(smokeMesh);
        
        let smoke1 = smokeMesh.clone();
        smoke1.position.x = smokeMesh.position.x;
        smoke1.position.y = smokeMesh.position.y + 0.1;
        smokeGroup.add(smoke1);

        let smoke2 = smokeMesh.clone();
        smoke2.position.x = smokeMesh.position.x - 0.05;
        smoke2.position.y = smokeMesh.position.y + 0.25;
        smokeGroup.add(smoke2);

        let smoke3 = smokeMesh.clone();
        smoke3.position.x = smokeMesh.position.x - 0.25;
        smoke3.position.y = smokeMesh.position.y + 0.2;
        smokeGroup.add(smoke3);

        let smoke4 = smokeMesh.clone();
        smoke4.position.x = smokeMesh.position.x - 0.25;
        smoke4.position.y = smokeMesh.position.y + 0.15;
        smokeGroup.add(smoke4);

        return smokeGroup;
    },
    updateMesh: function(mesh) {
        if(mesh.speed > 1) mesh.speed *= 0.95

        mesh.position.x -= mesh.speed;
        mesh.lifespan -= 1;
    },
    create: function(obj) {
        //set initial params
        if(!obj.Item) {
            obj.count = 0
            obj.frequency = 50
            obj.reset = 2000
            obj.Item = []
        }
        let returnObj;
        if(obj.count < obj.reset) {
            if(obj.count % obj.frequency == 0) {
                returnObj = this.createMesh();
            }
            obj.count++
            return returnObj
        } else {
            obj.count = 0
            return returnObj;
        }
    },
    remove: function(obj) {
        let removeids = [];
        for(let i=0 ; i<obj.Item.length; i++) {
            this.updateMesh(obj.Item[i]);
            if(obj.Item[i].lifespan <= 0) {
                removeids.push(obj.Item[i].id)
                obj.Item.splice(i,1)
            }
        }
        console.log('REMOVEE',removeids);
        console.log('REMOVEE LENGTH',removeids.length);
        return removeids
    }
}
export default smell;