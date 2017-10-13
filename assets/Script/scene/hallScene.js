var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.initUserInfo();
        this.initRoomInfoLayer();

        pomelo.clientScene = this;
        confige.curGameScene = this;
        confige.curSceneIndex = 1;

        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
            this.initWXShare();
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)
        {
            this.node.getChildByName("New Button").active = true;
            this.node.getChildByName("roomNum").active = true;
        }
        confige.joinState = false;

        console.log(cc.director.getVisibleSize());
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

        this.cardNumLabel.string = confige.curDiamond + "张";
        this.nicknameLabel.string = confige.userInfo.nickname;

        confige.getWXHearFrameNoSave(confige.userInfo.head,this.headSprite);
    },

    selectScore:function(event, customEventData){
        var index = parseInt(customEventData);
        this.basicScore = index;
    },
    selectRule:function(event, customEventData){
        var index = parseInt(customEventData);
        this.awardType = index;
    },
    selectRound:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 1)
        {
            if(this.playerMode == 1)
                this.gameTime = 10;
            else if(this.playerMode == 2)
                this.gameTime = 12;
        }else if(index == 2){
            if(this.playerMode == 1)
                this.gameTime = 20;
            else if(this.playerMode == 2)
                this.gameTime = 24;
        }
    },
    
    selectCardtype:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 1)
        {
            if(this.wuhuaniu)
                this.wuhuaniu = false;
            else 
                this.wuhuaniu = true;
        }else if(index == 2){
            if(this.zhadanniu)
                this.zhadanniu = false;
            else 
                this.zhadanniu = true;
        }else if(index == 3){
            if(this.wuxiaoniu)
                this.wuxiaoniu = false;
            else 
                this.wuxiaoniu = true;
        }
    },
    selectMode:function(event, customEventData){
        var index = parseInt(customEventData);
    },

    btnplayModeClick:function(event, customEventData){
        var index = parseInt(customEventData);
        if (index == 1) {
            console.log("121211221")
            this.showRoomInfoByIndex(index);
        }else if(index == 2){
            this.showRoomInfoByIndex(index);
        }
    },

    initRoomInfoLayer:function(){
        this.createRoomLayer = this.node.getChildByName("createRoomLayer");
        this.scoreSelectNode = this.createRoomLayer.getChildByName("scoreSelect");
        this.ruleSelectNode = this.createRoomLayer.getChildByName("ruleSelect");
        this.roundSelectNode = this.createRoomLayer.getChildByName("roundSelect");
        this.cardtypeSelectNode = this.createRoomLayer.getChildByName("cardtypeSelect");
        this.wuhuaniuNode = this.cardtypeSelectNode.getChildByName("cardtype1");
        this.zhadanniuNode = this.cardtypeSelectNode.getChildByName("cardtype2");
        this.wuxiaoniuNode = this.cardtypeSelectNode.getChildByName("cardtype3");
        this.resetRoomInfoLayer();
        
        this.roundDes1 = this.createRoomLayer.getChildByName("roundSelect").getChildByName("des1").getComponent("cc.Label");
        this.roundDes2 = this.createRoomLayer.getChildByName("roundSelect").getChildByName("des2").getComponent("cc.Label");
    },

    resetRoomInfoLayer:function(){
        this.playerMode = 1;
        this.gameTime = 10;
        this.basicScore = 1;
        this.awardType = 0;
        this.wuhuaniu = false;
        this.zhadanniu = false;
        this.wuxiaoniu = false;
        this.playerCount = 6;

        this.wuhuaniuNode.getComponent("cc.Toggle").isChecked = false;
        this.zhadanniuNode.getComponent("cc.Toggle").isChecked = false;
        this.wuxiaoniuNode.getComponent("cc.Toggle").isChecked = false;

        this.scoreSelectNode.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
        this.ruleSelectNode.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
        this.roundSelectNode.getChildByName("toggle1").getComponent("cc.Toggle").isChecked = true;
    },

    showRoomInfoByIndex:function(index){
        this.resetRoomInfoLayer();
        this.createRoomLayer.active = true;
        this.playerMode = index;
        if(this.playerMode == 1){
            this.gameTime = 10;
            this.playerCount = 6;
            this.roundDes1.string = "10局X1房卡";
            this.roundDes2.string = "20局X2房卡";
        }else if(this.playerMode == 2){
            this.gameTime = 12;
            this.playerCount = 9;
            this.roundDes1.string = "12局X1房卡";
            this.roundDes2.string = "24局X2房卡";
        }
    },

    btnCreateRoomOK:function(){
        console.log("this.playerCount==="+this.playerCount);
        console.log("this.gameTime==="+this.gameTime);
        console.log("this.basicScore==="+this.basicScore);
        console.log("this.awardType==="+this.awardType);
        pomelo.request("connector.entryHandler.sendData", {"code" : "agency","params" : {
            playerCount:this.playerCount,gameNumber: this.gameTime, gameType: "mingpaiqz",basic: this.basicScore,halfwayEnter: true,isWait:false,
            awardType:this.awardType,wuhuaniu:this.wuhuaniu,zhadanniu:this.zhadanniu,wuxiaoniu:this.wuxiaoniu}}, function(data) {
                console.log("clientCreateRoom flag is : " + data.flag)
                console.log(data);
                var curRoomID = data.msg.roomId;
                if(data.flag == true)
                {
                    confige.joinState = true;
                    pomelo.clientSend("join",{"roomId":curRoomID}, function() {
                        console.log("join room @@@@@@@");
                        confige.h5RoomID = curRoomID;
                        // pomelo.request("connector.entryHandler.getRoomInfo", {"roomId" : curRoomID}, function(data) {
                        //     console.log(data);
                        // });
                    });
                    // confige.h5RoomID = curRoomID;
                    // cc.director.loadScene('gameScene');
                }
                
                // if(data.flag == false)
                // {
                //     if(data.msg && data.msg.code)
                //     {
                //         pomelo.clientScene.showTips(tipsConf[data.msg.code]);
                //     }else{
                //         pomelo.clientScene.showTips("创建房间失败,请重新创建!");
                //     }
                // }else{
                //     console.log("data.flag == true");
                //     if(createType == "newRoom")
                //         if(data.msg && data.msg.roomId)
                //             pomelo.clientScene.showTips("创建房间成功!\n房间号为:" + data.msg.roomId, 1);
                // }
            }
        );
        this.createRoomLayer.active = false;
    },

    btnCreateRoomClose:function(){
        this.createRoomLayer.active = false;
    },

    joinRoom:function(){
        var curRoomID = parseInt(this.node.getChildByName("roomNum").getComponent("cc.EditBox").string);
        console.log("curRoomID === "+curRoomID);

        // pomelo.request("connector.entryHandler.sendData",{"code" : "join","params" : {"roomId" : curRoomID}},function(data) {
        //     console.log(data)
        // });
        pomelo.request("connector.entryHandler.getRoomInfo", {"roomId" : curRoomID}, function(data) {
            console.log(data);
            if(data.roomId)
            {
                confige.h5RoomID = data.roomId;
                cc.director.loadScene('gameScene');
            }else{
                console.log("data ===== {}");
            }
            

            // pomelo.clientSend("join",{"roomId":confige.h5RoomID}, function(data) {
            //     console.log("join room on hall @@@@@@@");
            //     console.log(data);
            // });
        });
    },

    initWXShare:function(){
        var curShareURL = "http://nnapi.5d8d.com/111?state=STATE";
        // curShareURL = "http://update.5d8d.com/111?state=STATE&refresh=1"
        var urlStateString = "0";
        
        curShareURL = curShareURL.replace("STATE", urlStateString);
        console.log("curShareURL===============");
        console.log(curShareURL);
                wx.onMenuShareAppMessage({
                    title: confige.shareTitle,
                    desc: confige.shareDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
                console.log("H5分享到朋友圈2222222");
                wx.onMenuShareTimeline({
                    title: confige.shareTitle,
                    desc: confige.shareDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
    },
});
