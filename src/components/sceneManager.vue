<template>
    <b-container id='background' fluid> 
         <b-row id='container'>
            <b-col id='scene' cols="8">
            </b-col>
            <b-col id='assets' cols="4">
            </b-col>
         </b-row>
         
    </b-container>
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
            createdObjects: {}
        }
    },
    methods: {
        setUp: function() {
            this.container = document.getElementById('container');
            this.camera = new Three.PerspectiveCamera(25,this.container.clientWidth/this.container.clientHeight,0.1,1000);
            this.camera.position.z = 50;
            this.camera.position.y = 6;
            this.camera.position.x = -5;
            this.scene = new Three.Scene();
            this.camera.lookAt(this.scene.position);
            this.renderer = new Three.WebGLRenderer({antialias: true,alpha:true});
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight, false);

            //lighting
            const ambientLight = new Three.AmbientLight( 0xffffff ,.5);
            const shadowLight = new Three.DirectionalLight(0xffffff, .1);
            shadowLight.position.set(50, 10, -80);
            shadowLight.castShadow = true;
            //shadowLight.shadow.camera.right = 15; //default:5
            //shadowLight.shadow.camera.top = 10;
            const backLight = new Three.DirectionalLight(0xffffff, .9);
            backLight.position.set(14, 200, 200);
            backLight.target.position.set(-100, 400, 200);
            backLight.castShadow = true;
            this.scene.add(backLight);
            this.scene.add(ambientLight);
            this.scene.add(shadowLight);
            //this.dragControls = new TransformControls(this.camera,this.renderer.domElement);
            //initial objects
            this.update(this.state,1)
            //
            this.raycaster = new Three.Raycaster();
            document.addEventListener('mousedown',this.onMouseDown,false);
            this.renderer.setAnimationLoop(() => {
                this.render();
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
                    switch(currentAction.Type) {
                        case 'create' :
                            if(!this.createdObjects[currentAction.Target]) this.createdObjects[currentAction.Target] = {};
                            
                            this.create(this.objects[currentAction.Target].create(this.createdObjects[currentAction.Target]),
                                        currentAction.Target,
                                        currentAction.TargetType);
                        break;
                        case 'remove':
                            this.remove(this.objects[currentAction.Target].remove(this.createdObjects[currentAction.Target]));
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
            var time = Date.now() / 1000;
            //raycaster to detect spray press
            this.raycaster.setFromCamera(this.mouse,this.camera);
            var intersectedObjects = this.raycaster.intersectObjects(this.scene.children,true);
            for(let i = 0; i < intersectedObjects.length; i++) {
                if(intersectedObjects[i].object.name) {
                    this.updateState(intersectedObjects[i].object.name);
                }
            }
            this.update(this.state,time);
            this.renderer.render(this.scene, this.camera);
        },
        
        // utility 
        create: function(object,refName,refType) {
            if(object) {
                this.scene.add(object);
                if(refType == 'Array') {
                    this.createdObjects[refName].Item.push(object);
                } else {
                    this.createdObjects[refName].Item = object;
                }
            }
        },
        remove: function(removeids) {
            for(let i=0; i<removeids.length; i++) {
                this.scene.remove(this.scene.getObjectById(removeids[i]));
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
                this.mouse.x = (event.clientX/this.container.clientWidth) * 2 -1;
                this.mouse.y = -(event.clientY/this.container.clientHeight) * 2 + 1
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
#background {
    height: 800px;
}

#container  {
    height: 800px;
}

#scene {
    background-color: #9db5e0;
}

#assets {
    background-color: rgb(9, 11, 29);
}

.moveup {
    margin-top: -300px;
}
</style>