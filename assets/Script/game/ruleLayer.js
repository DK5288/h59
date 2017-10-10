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
        this.tips1 = this.node.getChildByName("tips1").getComponent("cc.Label");        //MODE
        this.tips2 = this.node.getChildByName("tips2").getComponent("cc.Label");        //BASIC
        this.tips3 = this.node.getChildByName("tips3").getComponent("cc.Label");        //RULE
        this.tips4 = this.node.getChildByName("tips4").getComponent("cc.Label");        //ROUND
        
        console.log(confige.roomData);

        this.tips2.string = "" + confige.roomData.basic + "分";

        if(confige.roomData.awardType == 0)
            this.tips3.string = "牛牛x3牛九x2牛八x2";
        else if(confige.roomData.awardType == 1)
            this.tips3.string = "牛牛x4牛九x3牛八x2牛七x2";
        if(confige.roomData.maxGameNumber == 10 || confige.roomData.maxGameNumber == 12)
        {
            this.tips4.string = "" + confige.roomData.maxGameNumber + "局X1房卡";
        }
        if(confige.roomData.maxGameNumber == 20 || confige.roomData.maxGameNumber == 24)
        {
            this.tips4.string = "" + confige.roomData.maxGameNumber + "局X2房卡";
        }


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
