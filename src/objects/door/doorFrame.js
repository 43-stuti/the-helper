import * as Three from 'three';
import materials from '../../components/materials.js'
let frameHeight =  10;
let frameWidth = 5;
let frameThickness =  0.2;
var doorFrame = {
    create: function() {
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
        let frameMesh = new Three.Mesh(frameGeometry,materials.darkestPink);
        return frameMesh
    }
}
export default doorFrame;