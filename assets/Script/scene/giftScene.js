var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.sceneType = 0;     //0:sendLayer;1:giftLayer;2:giftHistory;

        this.sendLayer = this.node.getChildByName("sendLayer");
        this.giftLayer = this.node.getChildByName("giftLayer");
        this.giftHistory = this.node.getChildByName("giftHistory");

        this.initLayer(this.sceneType);
    },

    editBoxChange:function(){
        console.log(this.editBox.string);
        this.sendNumMin.string = this.editBox.string;
    },

    initLayer:function() {
        if(this.sceneType == 0)
        {
            this.cardNum = this.sendLayer.getChildByName("cardNum").getComponent("cc.Label");   //你的房卡：3张
            this.sendNum = this.sendLayer.getChildByName("sendNum").getComponent("cc.Label");

            this.sendNumMin = this.sendLayer.getChildByName("sendNumMin").getComponent("cc.Label");
            this.editBox = this.sendLayer.getChildByName("editBox").getComponent("cc.EditBox");
        }else if(this.sceneType == 1){
            this.giftHead = this.giftLayer.getChildByName("head").getComponent("cc.Sprite");
            this.giftName = this.giftLayer.getChildByName("name").getComponent("cc.Label");
        }else if(this.sceneType == 2){
            this.historyHead = this.giftHistory.getChildByName("head").getComponent("cc.Sprite");
            this.historyHeadMin = this.giftHistory.getChildByName("headMin").getComponent("cc.Sprite");
            this.historyTitle = this.giftHistory.getChildByName("title").getComponent("cc.Label");  //nick的房卡包
            this.historyNick = this.giftHistory.getChildByName("nick").getComponent("cc.Label");
            this.historyCardNum = this.giftHistory.getChildByName("cardNum").getComponent("cc.Label");  //1张房卡
            this.historyTime = this.giftHistory.getChildByName("time").getComponent("cc.Label");
        }
    },

    btnSendCard:function(){

    },

    btnGetCard:function(){

    },

    showLayer:function(){

    },

});
