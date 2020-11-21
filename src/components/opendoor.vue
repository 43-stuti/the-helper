<template>
    <b-container id='background' fluid class="cover"> 
         <b-row id='container'>
         </b-row>
         <div class="moveup">
            <b-row id='text1' class="h-100" align-h='center' align-v="center">
                <b-row class="h3 h-100 font-weight-bold text-white" align-h='center' align-v="center"> 
                    {{text.Heading}}
                </b-row>
            </b-row>
           
         </div>
         
         
    </b-container>
</template>
<script>
   import * as Three from 'three';
   import { TimelineLite } from 'gsap';
   //import { CubicBezierCurve3 } from 'three';
   //import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
    export default {
        name: 'opendoor',
        data() {
            return {
                    container: null,
                    camera:null,
                    scene: null,
                    renderer: null,
                    mesh: null,
                    doorFrame: null,
                    door:null,
                    doorKnob:null,
                    materials: {
                         matWhite : new Three.MeshLambertMaterial({color:0x1c2e4a}),
                         lightPink : new Three.MeshLambertMaterial({color: 0xFCBACB}),
                         darkPink : new Three.MeshLambertMaterial({color: 0Xd692a4}),
                         silver : new Three.MeshLambertMaterial({color:0xC0C0C0}),
                         darkestPink : new Three.MeshLambertMaterial({color:0xd16683}),
                         wood: new Three.MeshLambertMaterial({color:0xf4dfcc}),
                         darkGrey: new Three.MeshLambertMaterial({color:0x787777})
                    },
                    raycaster : null,
                    mouse: new Three.Vector2(),
                    timeline: new TimelineLite(),
                    frameHeight: 10,
                    frameWidth: 5,
                    frameThickness: 0.2,
                    doorG: null,
                    doorOpen: false,
                    smellParams : {
                        count:0,
                        array: [],
                        frequency: 100,
                        reset: 2000,
                        type:'smell',
                        active:false
                    },
                    aroma : {
                        count:0,
                        array: [],
                        frequency: 50,
                        reset: 2000,
                        type:'aroma',
                        active: false,
                        need: '',
                        lifespan : 300
                    },
                    disable:false,
                    state: 'dooropen',

                    //Aroma
                    perfumeBottle: null,
                    animateBottle: false,
                    bottleGeom: null,
                    bottleBase: null,
                    sprayPart: null,
                    topPart: null,
                    aromaParticles: [],
                    
                    //Room 
                    bedGroup:null
            }
        },
        methods: {
            init: function() {
                this.container = document.getElementById('container');
                this.camera = new Three.PerspectiveCamera(25,this.container.clientWidth/this.container.clientHeight,0.1,1000);
                this.camera.position.z = 50;
                this.camera.position.y = 5;
                this.camera.position.x = -5;
                this.scene = new Three.Scene();
                this.camera.lookAt(this.scene.position);
                this.renderer = new Three.WebGLRenderer({antialias: true,alpha:true});
                this.renderer.setSize(this.container.clientWidth, this.container.clientHeight, false);
                const ambientLight = new Three.AmbientLight( 0xffffff ,.5);
                const shadowLight = new Three.DirectionalLight(0xffffff, .5);
                shadowLight.position.set(200, 50, 200);
                shadowLight.castShadow = true;
                const backLight = new Three.DirectionalLight(0xffffff, .9);
                backLight.position.set(14, 200, 200);
                backLight.target.position.set(-100, 400, 200);
                backLight.castShadow = true;
                this.scene.add(backLight);
                this.scene.add(ambientLight);
                this.scene.add(shadowLight);
                //this.dragControls = new TransformControls(this.camera,this.renderer.domElement);
                this.container.appendChild(this.renderer.domElement);
                this.createFrame();
                this.createDoor();
                this.raycaster = new Three.Raycaster();
                document.addEventListener('mousedown',this.onMouseDown,false);
                this.renderer.setAnimationLoop(() => {
                    this.render();
                })
                
            },
            //lighting
            addLight: function() {
                let shadowLight = new Three.DirectionalLight(0xffffff,0.2);
                shadowLight.position.x = 8; 
            },
            //Door objects
            createFrame: function() {
                let rectangleShape = new Three.Shape()
                            .moveTo(0,0)
                            .lineTo(0,this.frameHeight)
                            .lineTo(this.frameWidth,this.frameHeight)
                            .lineTo(this.frameWidth,0)
                            .lineTo(0,0)
                let holePoints = [
                    new Three.Vector3(this.frameThickness, this.frameThickness,0),
                    new Three.Vector3(this.frameThickness,this.frameHeight-this.frameThickness,0),
                    new Three.Vector3(this.frameWidth-this.frameThickness,this.frameHeight-this.frameThickness,0),
                    new Three.Vector3(this.frameWidth-this.frameThickness,this.frameThickness,0) 
                ]
                let hole = new Three.Path();
                hole.fromPoints(holePoints);
                rectangleShape.holes = [hole]
                let extrudeSettings = {
                    steps:1,
                    depth:1,
                    bevelEnabled:false
                }
                let frameGeometry = new Three.ExtrudeGeometry(rectangleShape,extrudeSettings);
                this.doorFrame = new Three.Mesh(frameGeometry,this.materials.darkestPink);
                this.scene.add(this.doorFrame);
            },
            createDoor: function() {
                //this.doorG = new Three.Group();
                let doorShape = new Three.Shape()
                        .moveTo(this.frameThickness,this.frameThickness)
                        .lineTo(this.frameThickness,this.frameHeight-this.frameThickness)
                        .lineTo(this.frameWidth-this.frameThickness,this.frameHeight-this.frameThickness)
                        .lineTo(this.frameWidth-this.frameThickness,0)
                        .lineTo(this.frameThickness,this.frameThickness)
                let extrudeSettings = {
                    steps:1,
                    depth:1,
                    bevelEnabled:false
                }
                let doorGeometry = new Three.ExtrudeGeometry(doorShape,extrudeSettings);
                this.door = new Three.Mesh(doorGeometry,this.materials.darkPink);
                this.door.name = 'door';
                this.scene.add(this.door);

                //Door Knob
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
                this.doorKnob = new Three.Mesh(knobGeometry,this.materials.darkestPink);
                this.doorKnob.position.z = 0.5;
                this.doorKnob.name = 'knob'
                //this.doorG.name = 'door';
                //this.doorG.add(this.doorKnob);
                this.scene.add(this.doorKnob);

                
            },

            //Stench Objects
            /**createSmoke: function() {
                let smokeGroup = new Three.Group();
                let curve = new CubicBezierCurve3(
                    new Three.Vector3(20,6,-50),
                    new Three.Vector3(15,5.5,-48),
                    new Three.Vector3(20,5,-45),
                    new Three.Vector3(18,4.5,-40)
                );
                let points = curve.getPoints(50);
                let geometry = new Three.BufferGeometry().setFromPoints(points);
                let material = new Three.LineBasicMaterial( { color : 0x3d4142 } );
                let smoke = new Three.Line( geometry, material );
                smokeGroup.lifespan = 200
                //clone smoke
                //let smokeClone = smoke.clone();
                //smokeClone.position.x = smoke.position.x + 0.7;
                //smokeClone.rotateX(Math.PI/2)
                smokeGroup.speed = 0.05;
                //smokeGroup.opacityC = 0.02;
                smokeGroup.add(smoke);
                //smokeGroup.add(smokeClone);
                smokeGroup.position.y = Math.random() * (6-3)
                //smokeGroup.position.z = -10;
                this.scene.add(smokeGroup);
                return smokeGroup;
            }, **/
            createSmoke: function() {
                let smokeGroup = new Three.Group();
                smokeGroup.speed = 0.05;
                smokeGroup.lifespan = 500;
                
                let smokeBubble = new Three.SphereBufferGeometry(0.25,32,32);
                let smokeMesh = new Three.Mesh(smokeBubble,this.materials.darkGrey);
                smokeMesh.position.z = -40;
                smokeMesh.position.x = 13;
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
                
                this.scene.add(smokeGroup);
                return smokeGroup;
            },
            updateSmoke: function(obj) {
                 //obj.scale.z *= 0.002
                // obj.scale.y *= 0.992;
                //obj.scale.z *= 0.002;
                //obj.lifespan -= 1;
                if(obj.speed > 1) obj.speed *= 0.95
                obj.position.x -= obj.speed;
                if(!this.smellParams.active && obj.opacityC) {
                    if(obj.opacityC) obj.opacity *= obj.opacityC;
                    obj.lifespan -= 2;
                } else {
                    obj.lifespan -= 1;
                }

                if(obj.disperse && obj.lifespan == (obj.setLifespan-100)) {
                    obj.disperse = false
                }
            },

            //Aroma Objects
            createBottle: function() {
                let positionX = 3;
                let positionY = 6;
                let positionZ = -80
                //let rotatez = Math.PI/12;
                //let angle = 60;
                this.perfumeBottle = new Three.Group();

                    let geom = new Three.CylinderGeometry( 1, 1,8,10 );
                    this.bottleGeom = new Three.Mesh( geom, this.materials.darkPink );
                    this.bottleGeom.position.y = positionY;
                    this.bottleGeom.position.x = positionX 
                    this.bottleGeom.position.z = positionZ;
                    this.perfumeBottle.add(this.bottleGeom);

                    let geom2 = new Three.CylinderGeometry( 0.7, 1,0.5,10 );
                    this.bottleBase = new Three.Mesh( geom2, this.materials.darkestPink );
                    this.bottleBase.position.y = positionY + (4.2); 
                    this.bottleBase.position.x = positionX; 
                    console.log(this.bottleBase.position.y,this.bottleBase.position.x)
                    this.bottleBase.position.z = positionZ;
                    this.perfumeBottle.add(this.bottleBase);

                    let geom3 = new Three.CylinderGeometry( 0.7, 0.7,0.1,10 );
                    this.topPart = new Three.Mesh( geom3, this.materials.lightPink );
                    this.topPart.position.y = positionY + (4.5)
                    this.topPart.position.x = positionX 
                    this.topPart.position.z = positionZ;
                    this.perfumeBottle.add(this.topPart);

                    

                    let spary = new Three.CylinderGeometry( 0.5, 0.5,0.4,10 );
                    this.sprayPart = new Three.Mesh( spary, this.materials.silver );
                    this.sprayPart.position.y = positionY + (4.7)
                    this.sprayPart.position.x = positionX 
                    this.sprayPart.position.z = positionZ;
                    this.sprayPart.name = 'spray';
                    this.sprayPart.initialPosition = this.sprayPart.position.y;
                    //this.dragControls.object = this.sprayPart;
                    this.perfumeBottle.add(this.sprayPart);
                    //this.perfumeBottle.rotateZ(rotatez);
                    this.perfumeBottle.multiplier = 100;
                    this.perfumeBottle.positionX = this.perfumeBottle.position.x;
                    this.perfumeBottle.positionY = this.perfumeBottle.position.y;
                    this.scene.add(this.perfumeBottle);
                
            },
            createAroma: function() {
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
                this.scene.add(group);
                return group
            },
            update: function(obj) {
                obj.scale.x *= 0.992
                obj.scale.y *= 0.992;
                obj.scale.z *= 0.992;
                if(obj.speed > 1) obj.speed *= 0.095
                if(!this.smellParams.active) {
                    console.log('update opacity')
                    obj.material.opacity *= obj.opacity;
                    obj.lifespan -= 3;
                } else {
                    obj.lifespan -= 1;
                }
                obj.position.x -= obj.speed;
            },

            //Create bed
            createBed: function() {
                this.bedGroup = new Three.Group()
                let bedFrame = new Three.BoxBufferGeometry(2,0.5,7);
                let bedMesh = new Three.Mesh(bedFrame,this.materials.wood);
                bedMesh.position.z = -40;
                bedMesh.position.x = 10;
                bedMesh.position.y = 3;
                //bedMesh.material.opacity *= 0.01
                this.bedGroup.add(bedMesh)

                let mattressBase = new Three.BoxBufferGeometry(2,0.2,7);
                let mattressBaseMesh = new Three.Mesh(mattressBase,this.materials.silver);
                mattressBaseMesh.position.z = -40;
                mattressBaseMesh.position.x = 10;
                mattressBaseMesh.position.y = 3.35;
                mattressBaseMesh.receiveShadow = true
                this.bedGroup.add(mattressBaseMesh)

                let mattress = new Three.DodecahedronBufferGeometry(1,0);
                let mattressMesh = new Three.Mesh(mattress,this.materials.silver);
                mattressMesh.scale.y = 0.08;
                mattressMesh.scale.x = 1.1;
                mattressMesh.scale.z = 2;
                mattressMesh.position.z = -38;
                mattressMesh.position.x = 10;
                mattressMesh.position.y = 3.45;
                //this.bedGroup.add(mattressMesh)
                //mattressMesh.rotation.y = Math.PI/3;

                //ADD PILLOWS
                let pillow = new Three.DodecahedronBufferGeometry(0.5,0);
                let pillowMesh = new Three.Mesh(pillow,this.materials.pillow);
                pillowMesh.scale.x = 1.2;
                pillowMesh.scale.y = 0.5;
                pillowMesh.position.z = -42;
                pillowMesh.position.x = 9.5;
                pillowMesh.position.y = 3.5;
                pillowMesh.castShadow = true;
                this.bedGroup.add(pillowMesh);

                let secondPillow = pillowMesh.clone();
                secondPillow.position.x = 10.5;
                this.bedGroup.add(secondPillow);
                this.bedGroup.position.y = 0;
                this.scene.add(this.bedGroup);
            },
            createRoom: function() {
                let floor = new Three.BoxBufferGeometry(8,0.1,13);
                let floorMesh = new Three.Mesh(floor,this.materials.silver);
                floorMesh.position.z = -42;
                floorMesh.position.x = 10;
                floorMesh.position.y = 2.5;
                this.scene.add(floorMesh);

                let backwall = new Three.BoxBufferGeometry(8,6,0.1);
                let backwallMesh = new Three.Mesh(backwall,this.materials.darkGrey);
                backwallMesh.position.z = -48;
                backwallMesh.position.x = 10;
                backwallMesh.position.y = 5.5;
                this.scene.add(backwallMesh);
                //right wall
                let sideWall = new Three.BoxBufferGeometry(0.1,6,13);
                let sideWallMesh = new Three.Mesh(sideWall,this.materials.silver);
                sideWallMesh.position.z = -42;
                sideWallMesh.position.x = 14;
                sideWallMesh.position.y = 5.5;
                this.scene.add(sideWallMesh);
            },

            //Action based functions
            smokeTraversal(obj) {
                if(obj.count < obj.reset) {
                    if(obj.count % obj.frequency == 0 && obj.active) {
                        if(obj.type == 'smell') {
                            obj.array.push(this.createSmoke());
                        } else {
                            obj.array.push(this.createAroma());
                        }
                        
                    }
                    obj.count++
                } else {
                    obj.count = 0
                }
                for(let i=0 ; i<obj.array.length; i++) {
                    this.updateSmoke(obj.array[i]);
                    if(obj.array[i].lifespan <= 0) {
                        this.scene.remove(this.scene.getObjectById(obj.array[i].id));
                        obj.array.splice(i,1)
                    }
                }
            },
            openDoor() {
                this.doorOpen = true;
                this.state = 'dooropened';
                this.timeline.to(this.door.rotation, { rotation: 27, y:1.3, ease: "circ"})
                this.timeline.to(this.doorKnob.rotation, { rotation: 27, y:1.3, ease: "circ"},"-=1")
                this.timeline.to(this.camera.position, { duration: 1, x:3, ease: "circ"})
                this.timeline.to(this.camera.position, { duration: 1.5, z:-7, ease: "circ"},"-=1") 
                //this.timeline.to(this.camera.position, { duration: 1.5, y:12, ease: "circ"},"-=1") 
                this.timeline.to(document.getElementById('background'), {duration: 1, 'background-color': "#7b8496", ease: "none"},"-=1");
                this.timeline.to(this.aroma, {duration: 0.5, need: true, onComplete: () => {
                    this.smellParams.active = true;
                    this.createBed();
                    this.createRoom();

                }},"-=0.5");
                this.timeline.from(document.getElementById('text1'), {duration: 10, opacity: 0, ease: "back"},"+=1");
                this.timeline.from(document.getElementById('action'), {duration: 2, opacity: 0, ease: "back"},"+=1");
                this.timeline.to(this.aroma, {duration: 1, need: true, onComplete: () => {
                    this.createBottle();
                    this.animateBottle = true;

                }},"-=5");
            },
            onMouseDown: function(event) {
                this.mouseClick = true;
                //this.timeline.to(this.smoke.scale, { duration: , x:12, ease: "slow"})
                console.log('this.container.clientWidth',this.container.clientHeight)
                this.mouse.x = (event.clientX/this.container.clientWidth) * 2 -1;
                this.mouse.y = -(event.clientY/this.container.clientHeight) * 2 + 1
            },
            render () {
                var time = Date.now() / 1000;
                //raycaster to detect spray press
                this.raycaster.setFromCamera(this.mouse,this.camera);
                var intersectedObjects = this.raycaster.intersectObjects(this.scene.children,true);
                for(let i = 0; i < intersectedObjects.length; i++) {
                    if(intersectedObjects[i].object.name && intersectedObjects[i].object.name == "door") {
                        if(!this.doorOpen) {
                            this.openDoor();
                        }
                    }
                    console.log('intersectedObjects[i].object.name',intersectedObjects[i].object.name)
                    if(intersectedObjects[i].object.name && intersectedObjects[i].object.name == "spray") {
                            this.aroma.active = true;
                            this.timeline.to(this.smellParams, {duration: 6, need: true, onComplete: () => {
                                this.smellParams.active = false
                            }});
                            this.timeline.to(document.getElementById('background'), {duration: 1, 'background-color': "#9db5e0", ease: "none"},"-=4");
                    }
                }
                //var intersectedObjects = this.raycaster.intersectObjects(this.scene.children);
                if(this.smellParams.active || this.smellParams.array.length) {
                    this.smokeTraversal(this.smellParams)
                }

                if(this.aroma.active) {
                    this.smokeTraversal(this.aroma)
                }

                if(this.animateBottle) {
                    this.perfumeBottle.position.x =  this.perfumeBottle.positionX + Math.cos((Math.PI* (this.perfumeBottle.multiplier) * time)/180)*0.6;
                    this.perfumeBottle.position.y =  this.perfumeBottle.positionY + Math.sin((Math.PI* (this.perfumeBottle.multiplier) * time)/180)*0.3;
                }
               this.renderer.render(this.scene, this.camera);
            }
        },
        mounted() {
            this.init();
            //document.addEventListener('mousedown',this.onMouseDown,false);
            //document.addEventListener('mouseup',this.onMouseUp,false);
        },
        computed: {
            text() {
                switch (this.state) {
                case 'dooropen':
                    return {
                        Heading: "Click on the door to open it",
                        Description: "let's find out what she is upto"
                    }
                case 'dooropened':
                    return {
                        Heading: "Woahza! That smell isn't helping ",
                        Description: "let's fix it",
                        Action:true
                    }
                default:
                    return {height : '300px'};
                }
            }
        }
    }
</script>
<style scoped>
    #background {
        background-color: #9db5e0;
        height: 800px;
    }
    #container  {
        height: 800px;
        
    }
    #id {
        position: absolute;
    }
    .moveup {
        margin-top: -300px;
    }
</style>