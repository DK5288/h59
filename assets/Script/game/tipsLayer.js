var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        isInit:false,
    },

    // use this for initialization
    onLoad: function () {

    },

    onInit:function(){
        
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
