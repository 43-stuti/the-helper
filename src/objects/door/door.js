import * as Three from 'three';
import materials from '../../components/materials.js'
let frameHeight =  10;
let frameWidth = 5;
let frameThickness =  0.2;
var door = {
    create: function() {
        let doorShape = new Three.Shape()
                .moveTo(frameThickness,frameThickness)
                .lineTo(frameThickness,frameHeight-frameThickness)
                .lineTo(frameWidth-frameThickness,frameHeight-frameThickness)
                .lineTo(frameWidth-frameThickness,0)
                .lineTo(frameThickness,frameThickness)
        let extrudeSettings = {
            steps:1,
            depth:1,
            bevelEnabled:false
        }
        let doorGeometry = new Three.ExtrudeGeometry(doorShape,extrudeSettings);
        let doorObj = new Three.Mesh(doorGeometry,materials.darkPink);
        doorObj.name = 'door';

        let knobPositionX = 3.5;
        let knobPositionY = 4.5;
        let knobWidth = 0.2;
        let knobHeight = 1;
        let knobShape = new Three.Shape()
                    .moveTo(knobPositionX,knobPositionY)
                    .lineTo(knobPositionX,knobPositionY+knobHeight)
                    .lineTo(knobPositionX+knobWidth,knobPositionY+knobHeight)
                    .lineTo(knobPositionX+knobWidth,knobPositionY)
                    .lineTo(knobPositionX,knobPositionY)
        //Add hole points
        let knobGeometry = new Three.ExtrudeGeometry(knobShape,extrudeSettings);
        let doorKnob = new Three.Mesh(knobGeometry,materials.darkestPink);
        doorKnob.position.z = 0.5;
        doorKnob.name = 'knob';
        return doorObj;
    }
}
export default door;