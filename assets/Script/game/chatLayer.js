var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        parent:{
            default:null,
            type:cc.Node
        },
        isInit:false,
    },

    onLoad: function () {
    },

    onInit:function(){

        this.isInit = true;
    },

    onBtnChatLayerClick:function(event, customEventData){
        var clickIndex = parseInt(customEventData);

        if(clickIndex >= 0 && clickIndex < 20)
        {
            var quickIndex = clickIndex;
            pomelo.clientSend("say",{"msg": {"sayType":1, "index": quickIndex, "sex": confige.curSex}});
            console.log("quickIndex" + quickIndex);
        }

        this.hideLayer();
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