var confige = require("confige");
var pomeloClient = require("pomeloClient");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        confige.loginType = 0;
        pomeloClient();
        pomelo.clientLogin("1111","1111212");
    },

    // called every frame
    update: function (dt) {
        // var curSceneWidth = document.documentElement.clientWidth;
        // var curSceneHeight = document.documentElement.clientHeight;
        // console.log("curSceneWidth==="+curSceneWidth);
        // console.log("curSceneHeight==="+curSceneHeight);
        // cc.view.setDesignResolutionSize(curSceneWidth,curSceneHeight,cc.ResolutionPolicy.EXACT_FIT);
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

    },

    showRoomInfoByIndex:function(index){

    },
});
