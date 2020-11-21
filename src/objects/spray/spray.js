import * as Three from 'three';
import materials from '../../components/materials.js'
let positionX = 25;
let positionY = 6;
let positionZ = -80
var spray = {
    create: function() {
                //let rotatez = Math.PI/12;
                //let angle = 60;
        let perfumeBottle = new Three.Group();

        let geom = new Three.CylinderGeometry( 1, 1,8,10 );
        let bottleGeom = new Three.Mesh( geom, materials.darkPink );
        bottleGeom.position.y = positionY;
        bottleGeom.position.x = positionX 
        bottleGeom.position.z = positionZ;
        perfumeBottle.add(bottleGeom);

        let geom2 = new Three.CylinderGeometry( 0.7, 1,0.5,10 );
        let bottleBase = new Three.Mesh( geom2, materials.darkestPink );
        bottleBase.position.y = positionY + (4.2); 
        bottleBase.position.x = positionX; 
        bottleBase.position.z = positionZ;
        perfumeBottle.add(bottleBase);

        let geom3 = new Three.CylinderGeometry( 0.7, 0.7,0.1,10 );
        let topPart = new Three.Mesh( geom3, materials.lightPink );
        topPart.position.y = positionY + (4.5)
        topPart.position.x = positionX 
        topPart.position.z = positionZ;
        perfumeBottle.add(topPart);
        
        let spary = new Three.CylinderGeometry( 0.5, 0.5,0.4,10 );
        let sprayPart = new Three.Mesh( spary, materials.silver );
        sprayPart.position.y = positionY + (4.7)
        sprayPart.position.x = positionX 
        sprayPart.position.z = positionZ;
        sprayPart.name = 'spray';
        sprayPart.initialPosition = sprayPart.position.y;
        //this.dragControls.object = this.sprayPart;
        perfumeBottle.add(sprayPart);
        //obj.Item.ItemrotateZ(rotatez);
        perfumeBottle.multiplier = 100;
        perfumeBottle.positionX = perfumeBottle.position.x;
        perfumeBottle.positionY = perfumeBottle.position.y;
        return perfumeBottle;
    },
    update: function(obj,time) {
        obj.Item.position.x =  obj.Item.positionX + Math.cos((Math.PI* (obj.Item.multiplier) * time)/180)*0.6;
        obj.Item.position.y =  obj.Item.positionY + Math.sin((Math.PI* (obj.Item.multiplier) * time)/180)*0.3;
    }
}
export default spray;