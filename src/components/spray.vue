<template>
    <div id="container"
        
    > </div>
</template>
<script>
   import * as Three from 'three';
   import { TimelineLite } from 'gsap';
   //import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
    export default {
        name: 'spray',
        data() {
            return {
                    camera:null,
                    scene: null,
                    renderer: null,
                    mesh: null,
                    bottleGeom: null,
                    sprayPart: null,
                    topPart: null,
                    smokeParticles: [],
                    materials: {
                         matWhite : new Three.MeshLambertMaterial({color:0x1c2e4a}),
                         lightPink : new Three.MeshLambertMaterial({color: 0xFCBACB}),
                         darkPink : new Three.MeshLambertMaterial({color: 0Xd692a4}),
                         silver : new Three.MeshLambertMaterial({color:0xC0C0C0})
                    },
                    raycaster : new Three.Raycaster(),
                    mouse: new Three.Vector2(),
                    smokeCount : 5,
                    count : 0,
                    enableSpray: 0,
                    container: null,
                    mouseClick: false,
                    addSpray: false,
                    timeline: new TimelineLite()
            }
        },
        methods: {
            init: function() {
                this.container = document.getElementById('container');
                this.camera = new Three.PerspectiveCamera(25,this.container.clientWidth/this.container.clientHeight,0.1,1000);
                this.camera.position.z = 100;
                this.camera.position.y = 40;
                this.camera.position.x = 4;
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
                this.createBottle();
                
                this.renderer.setAnimationLoop(() => {
                    this.render();
                })
                
            },
            createBottle: function() {
                var loader = new Three.TextureLoader();
                loader.load('/three-assets/flower.jpg', image => {
                    let geom = new Three.CylinderGeometry( 5, 5,22,20 );
                    let material = new Three.MeshPhongMaterial( { 
                                    color: 0Xd692a4,
                                    bumpMap: image,
                                    bumpScale: 0.03
                                    });
                    this.bottleGeom = new Three.Mesh( geom, material );
                    this.bottleGeom.position.y = -6;
                    this.scene.add(this.bottleGeom);

                    let geom2 = new Three.CylinderGeometry( 4, 5,2,40 );
                    this.topPart = new Three.Mesh( geom2, this.materials.darkPink );
                    this.topPart.position.y = 6;
                    this.scene.add(this.topPart);

                    let geom3 = new Three.CylinderGeometry( 4, 4,.5,20 );
                    this.topPart = new Three.Mesh( geom3, this.materials.lightPink );
                    this.topPart.position.y = 7;
                    this.scene.add(this.topPart);

                    let geom4 = new Three.CylinderGeometry( 3, 3,3,20 );
                    this.topPart = new Three.Mesh( geom4, this.materials.lightPink );
                    this.topPart.position.y = 9;
                    this.topPart.name = 'spray';
                    this.scene.add(this.topPart);

                    let spary = new Three.CylinderGeometry( 1.5, 1.5,2,40 );
                    this.sprayPart = new Three.Mesh( spary, this.materials.silver );
                    this.sprayPart.position.y = 12;
                    this.sprayPart.name = 'spray';
                    this.sprayPart.initialPosition = this.sprayPart.position.y;
                    //this.dragControls.object = this.sprayPart;
                    this.scene.add(this.sprayPart);
                })
            },
            createSmoke: function() {
                let petalMat = new Three.MeshPhongMaterial({color: 0xF06292, side: Three.DoubleSide});
                let radius = 0.9;
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
                group.position.x = -2.5;
                group.position.y = 12;
                group.position.z = 4;
                group.lifespan = 300;
                group.speed = 0.08;
                group.offestX = Math.random()*1000;
                group.offestY = Math.random()*2000;
                this.scene.add(group);
                return group
            },
            update: function(obj) {
                obj.scale.x *= 0.992
                obj.scale.y *= 0.992;
                obj.scale.z *= 0.992;
                obj.lifespan -= 1;
                if(obj.speed > 1) obj.speed *= 0.095
                obj.position.x -= obj.speed;
            },
            changeSprayState: function() {
                
                //this.sprayPart.position.y = (this.mouseClick) ? 9.5 : this.sprayPart.initialPosition;
            },
            render () {
                //raycaster to detect spray press
                if(this.mouseClick) {
                    this.raycaster.setFromCamera(this.mouse,this.camera);
                    var intersectedObjects = this.raycaster.intersectObjects(this.scene.children);
                    for(let i = 0; i < intersectedObjects.length; i++) {
                        if(intersectedObjects[i].object.name && intersectedObjects[i].object.name == "spray") {
                            
                            this.changeSprayState()
                        }
                    }
                }
                if(this.enableSpray > 0 || this.smokeParticles.length) {
                    this.count += 1;
                    if(this.count < 150 && this.enableSpray > 0) {
                        if(this.count % 35 == 0) {
                            this.smokeParticles.push(this.createSmoke());
                            this.enableSpray --;
                        }
                    } else if(this.count > 100 ) {
                        this.count = 0;
                    }
                    for(let i=0 ; i<this.smokeParticles.length; i++) {
                        this.update(this.smokeParticles[i]);
                        if(this.smokeParticles[i].lifespan <= 0) {
                            this.scene.remove(this.scene.getObjectById(this.smokeParticles[i].id));
                            
                            this.smokeParticles.splice(i,1)
                        }
                    }
                }
                
                this.renderer.render(this.scene, this.camera);
            },
            onMouseDown: function(event) {
                this.mouseClick = true;
                this.enableSpray = this.enableSpray + 5 ;
                this.timeline.to(this.sprayPart.position, { duration: 1, y:10, ease: "circ"})
                
                this.mouse.x = (event.clientX/this.container.clientWidth) * 2 -1;
                this.mouse.y = -(event.clientY/this.container.clientHeight) * 2 + 1
            },
            onMouseUp: function() {
                this.mouseClick = false;
                this.timeline.to(this.sprayPart.position, { duration: 1, y: this.sprayPart.initialPosition, ease: "circ"},"+=2.5")
            }
        },
        mounted() {
            this.init();
            document.addEventListener('mousedown',this.onMouseDown,false);
            document.addEventListener('mouseup',this.onMouseUp,false);
        } 
    }
</script>
<style scoped>
    #container  {
        width: 100%;
        height: 800px;
    }
</style>