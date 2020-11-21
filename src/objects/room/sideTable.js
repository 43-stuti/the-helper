import * as Three from 'three';
import materials from '../../components/materials.js'
let frameHeight =  0.5;
let frameWidth = 0.5;
let frameThickness = 0.03;
let sideTable = {
    create: function() {
        let tables = new Three.Group();

        let tableGroup = new Three.Group();

        //table frame
        let rectangleShape = new Three.Shape()
                            .moveTo(0,0)
                            .lineTo(0,frameHeight)
                            .lineTo(frameWidth,frameHeight)
                            .lineTo(frameWidth,0)
                            .lineTo(0,0)
        let holePoints = [
            new Three.Vector3(frameThickness, frameThickness,0),
            new Three.Vector3(frameThickness,frameHeight-frameThickness,0),
            new Three.Vector3(frameWidth-frameThickness,frameHeight-frameThickness,0),
            new Three.Vector3(frameWidth-frameThickness,frameThickness,0) 
        ]
        let hole = new Three.Path();
        hole.setFromPoints(holePoints);
        rectangleShape.holes = [hole]
        let extrudeSettings = {
            steps:1,
            depth:1,
            bevelEnabled:false
        }
        let frameGeometry = new Three.ExtrudeGeometry(rectangleShape,extrudeSettings);
        let frameMesh = new Three.Mesh(frameGeometry,materials.wood);
        frameMesh.position.x = 4;
        frameMesh.position.y = 2.6;
        frameMesh.position.z = -47.5 + frameThickness;
        tableGroup.add(frameMesh);

        let drawer = new Three.BoxBufferGeometry(0.44,0.20,1);
        let drawerMesh = new Three.Mesh(drawer,materials.matWhite);
        drawerMesh.position.x = 4 + drawer.parameters.width/2 + frameThickness;
        drawerMesh.position.y = 2.6 + drawer.parameters.height/2 + frameThickness;
        drawerMesh.position.z = -47;
        tableGroup.add(drawerMesh);

        let lowerDrawer = drawerMesh.clone();
        lowerDrawer.position.y = drawerMesh.position.y + drawer.parameters.height + frameThickness;
        tableGroup.add(lowerDrawer);
        
        let separator = new Three.BoxBufferGeometry(0.44,0.025,1);
        let separatorMesh = new Three.Mesh(separator,materials.wood);
        separatorMesh.position.x = 4 + separator.parameters.width/2 + frameThickness;
        separatorMesh.position.y = drawerMesh.position.y + drawer.parameters.height/2+separator.parameters.height/2 ;
        separatorMesh.position.z = -47;
        tableGroup.add(separatorMesh);

        tables.add(tableGroup);
        let tableClone = tableGroup.clone();
        tableClone.position.x = tableGroup.position.x - 2 - drawer.parameters.width - 0.06 ;
        tables.add(tableClone);
        return tables
    }
} 
export default sideTable;
