var confige = require("confige");
var pomeloClient = require("pomeloClient");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        confige.enterSceneIndex = 0;        //0:hall;1:user;2:game;3:gift;
        // confige.h5SceneID = 3;
        confige.loginType = 0;
        pomeloClient();
        // pomelo.clientLogin("","1111212");

        var RequestData = {};
        RequestData = this.GetRequest();
        console.log("打印url参数!!!!!");
        console.log(RequestData);
        // if(RequestData.refresh)
        // {
        //     var newUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc36a5e9d4a56e1c2&redirect_uri=http%3A%2F%2Fupdate.5d8d.com%2F111&response_type=code&scope=snsapi_userinfo&state=STATE";
        //     newUrl = newUrl.replace("STATE", RequestData.state);
        //     window.open(newUrl);
        //     // window.close();
        //     return;
        // }

        if(RequestData.code)
        {
            if(RequestData.state && RequestData.state != "STATE")
            {
                confige.h5SceneID = RequestData.state.substring(0,1) 
                confige.h5RoomID = RequestData.state.substring(2,RequestData.state.length)
            }

            confige.curUseCode = RequestData.code;
            confige.loginType = 2;
            pomelo.clientLogin(-1,-1);
        }


        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER){
            this.node.getChildByName("uid").active = true;
            this.node.getChildByName("New Button").active = true;
            this.join();
        }
        // "http://update.5d8d.com/111?state=STATE&refresh=1"
        // "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc36a5e9d4a56e1c2&redirect_uri=http%3A%2F%2Fupdate.5d8d.com%2F111&response_type=code&scope=snsapi_userinfo&state=STATE";
    },

    // called every frame
    update: function (dt) {
        // var curSceneWidth = document.documentElement.clientWidth;
        // var curSceneHeight = document.documentElement.clientHeight;
        // console.log("curSceneWidth==="+curSceneWidth);
        // console.log("curSceneHeight==="+curSceneHeight);
        // cc.view.setDesignResolutionSize(curSceneWidth,curSceneHeight,cc.ResolutionPolicy.EXACT_FIT);
    },

    join:function(){
        var curUid = this.node.getChildByName("uid").getComponent("cc.EditBox").string;
        console.log("curUid == "+curUid);
        if(curUid == "")
            curUid = null;
        
        confige.h5SceneID = 0;
        pomelo.clientLogin(curUid,"1111212");
    },

    GetRequest:function(){
        confige.h5SignURL = location.href;
        console.log("完整路径11111====="+confige.h5SignURL);
        var url = location.search; //获取url中"?"符后的字串
        console.log(url);
        var theRequest = new Object();
        var strs = [];
        if (url.indexOf("?") != -1) {   
           var str = url.substr(1);   
           strs = str.split("&");   
           for(var i = 0; i < strs.length; i ++) {   
              theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
           }   
        }   
        return theRequest;
    },
});
