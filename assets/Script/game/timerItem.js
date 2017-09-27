cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        timeNumLabel:{
            default:null,
            type:cc.Label
        },
    },

    // use this for initialization
    onLoad:function () {
    },

    onInit: function(){
        this.curTimeNum = 0;
        this.timeNumMax = 0;
        this.timeUpdate = -1;
    },

    setTime:function(newTimeNum){
        this.timeNumMax = newTimeNum;
        this.curTimeNum = newTimeNum;
        this.timeNumLabel.string = this.curTimeNum;
        if(this.timeUpdate != -1)
            this.unschedule(this.timeUpdate);

        this.timeUpdate = function () {
            this.curTimeNum--;
            this.timeNumLabel.string = this.curTimeNum;
            if (this.curTimeNum == 0) 
            {
                this.hideTimer();
                this.unschedule(this.timeUpdate);
                this.timeUpdate = -1;
            }
        };
        this.schedule(this.timeUpdate, 1);
        this.showTimer();
    },

    showTimer:function(){
        this.node.active = true;
    },

    hideTimer:function(){
        this.node.active = false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
