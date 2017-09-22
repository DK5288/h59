var confige = require("confige");
var pomeloClient = require("pomeloClient");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        confige.enterSceneIndex = 0;        //0:hall;1:user;2:game;
        confige.loginType = 0;
        pomeloClient();
        pomelo.clientLogin("1112","1111212");
    },

    // called every frame
    update: function (dt) {
        // var curSceneWidth = document.documentElement.clientWidth;
        // var curSceneHeight = document.documentElement.clientHeight;
        // console.log("curSceneWidth==="+curSceneWidth);
        // console.log("curSceneHeight==="+curSceneHeight);
        // cc.view.setDesignResolutionSize(curSceneWidth,curSceneHeight,cc.ResolutionPolicy.EXACT_FIT);
    },
});
