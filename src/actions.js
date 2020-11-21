var actionList = {
    '1' : {
        Name:'CreateDoor',
        ActionSequence: [{
            Type: 'create',
            Target: 'door',
            TargetType:'Object'
        }, {
            Type: 'create',
            Target: 'doorFrame',
            TargetType:'Object'
        }]
    },
    '2' : {
        Name:'OpenDoor',
        ActionSequence: [{
            Target:'door',
            Type: 'gsapanimate',
            Prop: 'rotation',
            UpdateParams: { rotation: 27, y:1.3, ease: "circ"},
            Delay: '0',
            Motion: 'to'
        }, {
            Target:'camera',
            Type: 'gsapanimate',
            Prop: 'position',
            UpdateParams: { duration: 1, x:4, ease: "circ"},
            Motion: 'to',
            SceneObject: true
        }, {
            Target:'camera',
            Type: 'gsapanimate',
            Prop: 'position',
            UpdateParams: { duration: 1, z:-17, ease: "circ"},
            Delay: "-=1",
            Motion: 'to',
            SceneObject: true
        }, {
            Target:'background',
            Type: 'DOMupdate',
            UpdateParams: {duration: 1, 'background-color': "#262626", ease: "none"},
            Delay: "-=1",
            Motion: 'to'
        }, {
            Type: 'create',
            Target: 'bed',
            TargetType:'Object'
        }, {
            Type: 'create',
            Target: 'room',
            TargetType:'Object'
        }, {
            Type: 'create',
            Target: 'lamp',
            TargetType:'Object'
        }, {
            Type: 'create',
            Target: 'sideTable',
            TargetType:'Object'
        }, {
            Target:'smell',
            Type: 'gsapupdate',
            UpdateSelf: true,
            UpdateParams: { duration: 1, Type:'create', ease: "circ"},
            Delay: "-=0.5",
            Motion: 'to',
            TargetType:'Array',
            Repeat: true
        },  {
            Target:'smell',
            Type: 'gsapupdate',
            UpdateSelf: true,
            UpdateParams: { duration: 1, Type:'remove', ease: "circ"},
            Delay: "-=1",
            Motion: 'to',
            TargetType:'Array',
            Repeat: true
        }, {
            Target:'spray',
            Type: 'gsapupdate',
            UpdateSelf: true,
            UpdateParams: { Type:'create', ease: "circ"},
            Delay: "+=1",
            Motion: 'to',
            TargetType:'Object'
        }, {
            Target:'spray',
            Type: 'gsapupdate',
            UpdateSelf: true,
            UpdateParams: { Type:'threeanimate', ease: "circ"},
            Delay: "-=0.5",
            Motion: 'to',
            TargetType:'Object',
            Repeat: true
        }]
    },
    '3' : {
        Name:'PerfumeSpray',
        ActionSequence:[
            {
                Target:'spray',
                Type: 'gsapupdate',
                UpdateSelf: true,
                UpdateParams: { Type:'threeanimate', ease: "circ"},
                Delay: "-=0.5",
                Motion: 'to',
                TargetType:'Object',
                Repeat: true
            },
            {
                Type: 'create',
                Target: 'aroma',
                TargetType:'Array',
                Repeat:true
            }, {
                Type: 'remove',
                Target: 'aroma',
                TargetType:'Array',
                Repeat:true
            }, {
                Type: 'remove',
                Target: 'smell',
                TargetType:'Array',
                Repeat:true
            },
            {
                Target:'background',
                Type: 'DOMupdate',
                UpdateParams: {duration: 3, 'background-color': "#42c2c2", ease: "none"},
                Delay: "+=2",
                Motion: 'to'
            }
        ]
    }
}
export default actionList;