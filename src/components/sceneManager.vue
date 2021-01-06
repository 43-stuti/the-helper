<template>
<div>
        <div id="container"> </div>
            <span id='scene' class="diagram left">
            </span>
            <span id='assets'>
            </span>
        </div>
</template>

<script>
import * as Three from 'three';
import { TimelineLite } from 'gsap';
import actionList from '../actions.js';
import objects from '../components/objects.js'

export default {
    name:'sceneManager',
    data() {
        return {
            container:null,
            camera:null,
            renderer:null,
            state: 1,
            raycaster : null,
            mouse: new Three.Vector2(),
            timeline: new TimelineLite(),
            objects: objects,
            createdObjects: {},
            sceneMain: null,
            sceneAction: null,
            time: 0
        }
    },
    methods: {
        makeScene: function(elem) {
            let scene = new Three.Scene();
            //let container = elem.getBoundingClientRect();
                    let camera = new Three.PerspectiveCamera(45,2,0.1,200);
                    camera.position.z = 2;
        camera.position.set(0, 1, 2);
        camera.lookAt(0, 0, 0);
                    //camera.lookAt(scene.position);
                    {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new Three.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }
        
        return {scene, camera, elem};
        },
        setupMain: function() {
            console.log('setupMain')
            const sceneInfo = this.makeScene(document.querySelector('#scene'));
            const geometry = new Three.BoxBufferGeometry(1, 1, 1);
            const material = new Three.MeshPhongMaterial({color: 'red'});
            const mesh = new Three.Mesh(geometry, material);
            sceneInfo.scene.add(mesh);
            console.log('POSITION',mesh.position);
            sceneInfo.Name = 'Main'
            return sceneInfo;
        },
        setupAction: function() {
            console.log('setupAction')
            const sceneInfo = this.makeScene(document.querySelector('#assets'));
            return sceneInfo;
        },
        renderSceneInfo: function(sceneInfo) {
            const {scene, camera, elem} = sceneInfo;
            //console.log('EEEEEL',elem)
            const {left, right, top, bottom, width, height} = elem.getBoundingClientRect();
            const isOffScreen = 
                bottom < 0 || 
                top > this.renderer.domElement.clientHeight || 
                right < 0 || 
                left > this.renderer.domElement.clientWidth;
            if(isOffScreen) {
                return false;
            }
            //
            //camera.aspect = width/height;
            //console.log('elem',elem,right,top,left,bottom);
            const positiveYUpBottom = this.renderer.domElement.clientHeight - bottom;
            this.renderer.setScissor(left, positiveYUpBottom, width, height);
            this.renderer.setViewport(left, positiveYUpBottom, width, height);
            this.renderer.render(scene, camera); 
            //this.renderer.render(this.sceneMain.scene, this.sceneMain.camera);
        },
        updateObjs: function() {
            var time = Date.now() / 1000;
            //raycaster to detect spray press
            this.raycaster.setFromCamera(this.mouse,this.sceneMain.camera);
            //console.log('MOUSE',this.sceneMain.scene.children)
            var intersectedObjects = this.raycaster.intersectObjects(this.sceneAction.scene.children,true);
            if(intersectedObjects) {
                console.log('YAYYYY',intersectedObjects)
            }
            for(let i = 0; i < 5; i++) {
                /*if(intersectedObjects[i].object.name) {
                    this.updateState(intersectedObjects[i].object.name);
                }*/
            }
            this.update(this.state,time);
        },
        renderScene: function() {
            this.resizeRendererToDisplaySize();
            
            this.renderer.setScissorTest(false);
            this.renderer.clear(true, true);
            this.renderer.setScissorTest(true);
            
            this.updateObjs();
            this.renderSceneInfo(this.sceneMain);
            this.renderSceneInfo(this.sceneAction);
            //requestAnimationFrame(this.renderScene);
        },
        resizeRendererToDisplaySize: function() {
            const canvas = this.renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
            this.renderer.setSize(width, height, false);
            }
            return needResize;
        },
        setUp: function() {
            this.container = document.querySelector('#container');
            this.renderer = new Three.WebGLRenderer({antialias: true,alpha:true});
            this.sceneMain = this.setupMain();
            this.sceneAction = this.setupAction();
            this.renderer.setSize(this.container.clientWidth, this.clientHeight, false);
            this.raycaster = new Three.Raycaster();
            document.addEventListener('mousedown',this.onMouseDown,false);
            this.renderer.setAnimationLoop(() => {
                this.renderScene(this.sceneMain);
            })
            this.container.appendChild(this.renderer.domElement);
        },
        update: function(state,time) {
            let actions = actionList[state].ActionSequence;
            for(let i=0 ; i<actions.length ; i++) {
                let currentAction = actions[i];
                if(currentAction.Repeat || !currentAction.Done) {
                    if(!currentAction.Repeat) {
                        currentAction.Done = true;
                    }
                    console.log('this.sceneMain2222',this.sceneMain,this.sceneAction)
                        let sceneInfo = this.sceneMain.scene;
                        if(currentAction.Scene == 'Action') {
                            sceneInfo = this.sceneAction.scene;
                        }
                    switch(currentAction.Type) {
                        case 'create' :
                            if(!this.createdObjects[currentAction.Target]) this.createdObjects[currentAction.Target] = {};
                            this.create(this.objects[currentAction.Target].create(this.createdObjects[currentAction.Target]),
                                        currentAction.Target,
                                        currentAction.TargetType,sceneInfo);
                        break;
                        case 'remove':
                            this.remove(this.objects[currentAction.Target].remove(this.createdObjects[currentAction.Target]),sceneInfo);
                        break;
                        case 'threeanimate':
                            this.objects[currentAction.Target].update(this.createdObjects[currentAction.Target],time);
                        break;
                        case 'gsapanimate':
                            this.gsapanimate('object',currentAction.Prop , currentAction.Target,
                                                        currentAction.UpdateParams,
                                                        currentAction.Delay,
                                                        currentAction.Motion,currentAction.SceneObject);
                        break;
                        case 'gsapupdate':
                            this.gsapupdate(currentAction ,
                                                        currentAction.UpdateParams,
                                                        currentAction.Delay);
                            currentAction.Done = false;
                        break;
                        case 'DOMupdate':
                            //call gsapanimate
                            this.gsapanimate('DOMupdate',currentAction.Prop , currentAction.Target,
                                                        currentAction.UpdateParams,
                                                        currentAction.Delay,
                                                        currentAction.Motion,currentAction.SceneObject);
                        break;
                    }
                }
            }
        },
        updateState: function(object) {
            switch(object) {
                case 'door':
                    if(this.state != 2) {
                        this.state = 2;
                        this.timeline.clear();
                    }
                break;
                case 'spray':
                    if(this.state != 3) {
                        this.state = 3;
                        this.timeline.clear();
                    }
                break;
            }
        },
        render: function() {
            /*var time = Date.now() / 1000;
            //raycaster to detect spray press
            this.raycaster.setFromCamera(this.mouse,this.camera);
            var intersectedObjects = this.raycaster.intersectObjects(this.sceneMain.scene.children,true);
            for(let i = 0; i < intersectedObjects.length; i++) {
                if(intersectedObjects[i].object.name) {
                    this.updateState(intersectedObjects[i].object.name);
                }
            }
            this.update(this.state,time);*/
            this.renderer.render(this.sceneMain.scene, this.sceneMain.camera);
        },
        
        // utility 
        create: function(object,refName,refType,sceneInfo) {
            if(object) {
                sceneInfo.add(object);
                if(refType == 'Array') {
                    this.createdObjects[refName].Item.push(object);
                } else {
                    this.createdObjects[refName].Item = object;
                }
            }
        },
        remove: function(removeids,sceneInfo) {
            for(let i=0; i<removeids.length; i++) {
                sceneInfo.remove(this.scene.getObjectById(removeids[i]));
            }
        },
        gsapanimate: function(type,prop,objectName,updateparams,delay,motion,isSceneObj) {
            let target;
            if(type == 'DOMupdate') {
                target = document.getElementById(objectName)
            } else {
                if(isSceneObj) {
                    target = this[objectName];
                } else {
                    target = this.createdObjects[objectName].Item;
                }
            }

            if(motion == 'to') {
                if(prop) {
                    this.timeline.to(target[prop],updateparams,delay);
                } else {
                    this.timeline.to(target,updateparams,delay);
                }
            } else {
                this.timeline.from(target[prop],updateparams,delay);
            }
        },
        gsapupdate: function(target,updateparams,delay) {
            this.timeline.to(target,updateparams,delay);
        },
        onMouseDown: function(event) {
                //let curr = document.querySelector('#scene')
                this.mouse.x = ( ( event.clientX - this.renderer.domElement.offsetLeft ) / this.renderer.domElement.clientWidth ) * 2 - 1;
                this.mouse.y = - ( ( event.clientY - this.renderer.domElement.offsetTop ) / this.renderer.domElement.clientHeight ) * 2 + 1;
                console.log('HELLOOO',this.mouse.x,this.mouse.y);
            },
    },
    mounted() {
        this.setUp();
        //document.addEventListener('mousedown',this.onMouseDown,false);
        //document.addEventListener('mouseup',this.onMouseUp,false);
    }

}
</script>
<style scoped>
#c {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
}

#container  {
    position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
}
.diagram {
  display: inline-block;
  width: 10em;
  height: 7em;
  border: 1px solid black;
}
.left {
  float: left;
  margin-right: .25em;
}
#scene1 {
background-color: #9db5e0;
display: inline-block;
  border: 1px solid black;
  height: 400px;
  width: 400px;
  float: left;
}

#assets {
    background-color: rgb(9, 11, 29);
}

.moveup {
    margin-top: -300px;
}
</style>