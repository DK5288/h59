var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        oriItem:{
            default:null,
            type:cc.Node
        },
        isInit:false,
    },

    // use this for initialization
    onLoad: function () {

    },

    onInit:function(){
        var colorWin = new cc.Color(221,183,82);
        var colorLose = new cc.Color(231,220,191);
        this.roomid = this.node.getChildByName("roomid").getComponent("cc.Label");
        this.time = this.node.getChildByName("time").getComponent("cc.Label");
        this.roomround = this.node.getChildByName("roomround").getComponent("cc.Label");

        this.beginY = -80;
        this.offsetY = -150;
        this.isInit = true;
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.node.active = false;
    },
});
