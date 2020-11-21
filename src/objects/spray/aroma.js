import * as Three from 'three';
var aroma = {
    createMesh: function() {
        let petalMat = new Three.MeshPhongMaterial({color: 0xF06292, side: Three.DoubleSide});
        let radius = 0.3;
        // each petal mesh is made of a part of a sphere
        let petalGeom = new Three.SphereBufferGeometry( radius, 20, 20, Math.PI / 4, Math.PI / 2, 0.4, Math.PI * 0.9 );
        // change pivot point - petals are generated around it
        petalGeom.translate(0, -radius, 0);
        petalGeom.rotateX(Math.PI / 2);
        
        let petalMesh = new Three.Mesh(petalGeom, petalMat);
        
        let petalCount = 5;
        let rotationStep = Math.PI * 2 / petalCount;
        
        let petalMeshes = [];
        let group = new Three.Group();
        for (let i = 0; i < petalCount; i ++) {
            petalMeshes[i] = petalMesh.clone();
            // generating the petals, rotated around a pivot point
            petalMeshes[i].rotation.y = rotationStep * i;
            //petalMeshes[i].position.y = -i/2.5;
            petalMeshes[i].rotateY(Math.PI/3.5)
            group.add(petalMeshes[i])
        }
        group.rotateX(Math.PI/2)
        group.position.x = 20;
        group.position.y = Math.random() * (6-5);
        group.position.z = -50;
        group.lifespan = 500;
        group.setLifespan = group.lifespan
        group.speed = 0.08;
        group.offestX = Math.random()*1000;
        group.offestY = Math.random()*2000;
        group.disperse = true;
        return group
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
            obj.frequency = 100
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
        return removeids
    }
}
export default aroma;