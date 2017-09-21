var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.initUserInfo();
        this.initRoomInfoLayer();
    },

    // called every frame
    update: function (dt) {
        // var curSceneWidth = document.documentElement.clientWidth;
        // var curSceneHeight = document.documentElement.clientHeight;
        // console.log("curSceneWidth==="+curSceneWidth);
        // console.log("curSceneHeight==="+curSceneHeight);
        // cc.view.setDesignResolutionSize(curSceneWidth,curSceneHeight,cc.ResolutionPolicy.EXACT_FIT);
    },

    initUserInfo:function(){
        this.userInfoNode = this.node.getChildByName("userInfo");
        this.headSprite = this.userInfoNode.getChildByName("headImg").getComponent("cc.Sprite");
        this.cardNumLabel = this.userInfoNode.getChildByName("cardNum").getComponent("cc.Label");
        this.nicknameLabel = this.userInfoNode.getChildByName("nickname").getComponent("cc.Label");

        // this.cardNumLabel.string = confige.curDiamond + "张";
        // this.nicknameLabel.string = confige.userInfo.nickname;
    },

    selectScore:function(event, customEventData){
        var index = parseInt(customEventData);
    },
    selectRule:function(event, customEventData){
        var index = parseInt(customEventData);
    },
    selectRound:function(event, customEventData){
        var index = parseInt(customEventData);
    },
    selectCardtype:function(event, customEventData){
        var index = parseInt(customEventData);
    },
    selectMode:function(event, customEventData){
        var index = parseInt(customEventData);
    },
    selectCardtype:function(event, customEventData){
        var index = parseInt(customEventData);
    },

    btnGameModeClick:function(event, customEventData){
        var index = parseInt(customEventData);
        if (index == 1) {
            this.showRoomInfoByIndex(index);
        }else if(index == 2){
            this.showRoomInfoByIndex(index);
        }
    },

    initRoomInfoLayer:function(){
        this.createRoomLayer = this.node.getChildByName("createRoomLayer");
        this.roundDes1 = this.createRoomLayer.getChildByName("roundSelect").getChildByName("des1").getComponent("cc.Label");
        this.roundDes2 = this.createRoomLayer.getChildByName("roundSelect").getChildByName("des2").getComponent("cc.Label");
    },

    showRoomInfoByIndex:function(index){
        this.createRoomLayer.active = true;
    },

    btnCreateRoomOK:function(){
        this.createRoomLayer.active = false;
    },

    btnCreateRoomClose:function(){
        this.createRoomLayer.active = false;
    },
});
