var gameData = require("gameData");
var confige = require("confige");
cc.Class({
    extends: cc.Component,

    properties: {
        sayItemPrefab:{
            default:null,
            type:cc.Prefab
        },
    },

    onDestory:function(){
        console.log("gameInfoNode onDestory!!!!!!")
        if(confige.curUsePlatform == 1)
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "gameInfoNode onDestory!!!!!!");
    },

    onLoad: function () {
    },

    onInit:function(){
        gameData.gameInfoNode = this;
        //处理当前房间信息
        this.cardMode = confige.roomData.cardMode;
        this.gameMode = confige.roomData.gameMode;
        this.bankerMode = confige.roomData.bankerMode;

        if(confige.playerMax == 6){
            console.log("fuck");
            this.roomTime = this.node.getChildByName("topNode").getChildByName("roundLabel").getComponent("cc.Label");
            this.basicLabel = this.node.getChildByName("bottomNode").getChildByName("basicLabel").getComponent("cc.Label");
            this.diamondLabel = this.node.getChildByName("topNode").getChildByName("cardNum").getComponent("cc.Label");
        }else{
            this.roomTime = this.node.getChildByName("topNode").getChildByName("roundLabel").getComponent("cc.Label");
            this.basicLabel = this.node.getChildByName("topNode").getChildByName("basicLabel").getComponent("cc.Label");
            this.diamondLabel = this.node.getChildByName("bottomNode").getChildByName("cardNum").getComponent("cc.Label");
        }
        this.diamondLabel.string = "" + confige.curDiamond + "张";
        this.basicLabel.string = "底分："+confige.roomData.basic+"分";
        console.log("confige.roomData.gameNumber === " + confige.roomData.gameNumber);
        this.roomCurTime = confige.roomData.gameNumber;
        console.log("this.roomCurTime === " + this.roomCurTime);
        this.roomMaxTime = confige.roomData.maxGameNumber;
        
        console.log("fuck !!!!!!===" + this.roomCurTime);
        this.joinState = confige.roomData.state;

        this.roomTime.string = this.roomCurTime + " / " + this.roomMaxTime + "局";
        console.log("fuck room time string === " + this.roomTime.string);

        this.layerNode = this.node.getChildByName("layerNode");

        this.chatLayer = -1;       
        this.settingLayer = -1;
        this.ruleLayer = -1;
        this.tipsLayer = -1;

        this.chatLayerLoad = false;       
        this.settingLayerLoad = false;
        this.ruleLayerLoad = false;
        this.tipsLayerLoad = false;

        this.quickStringList = {};
        this.quickStringList[0] = "玩游戏，请先进群";
        this.quickStringList[1] = "群内游戏，请勿转发";
        this.quickStringList[2] = "别磨蹭，快点打牌";
        this.quickStringList[3] = "我出去叫人";
        this.quickStringList[4] = "你的牌好靓哇";
        this.quickStringList[5] = "我当年横扫澳门五条街";
        this.quickStringList[6] = "算你牛逼";
        this.quickStringList[7] = "别和我抢庄";
        this.quickStringList[8] = "输的裤衩都没了";
        this.quickStringList[9] = "我给你们送温暖了";
        this.quickStringList[10] = "谢谢老板";

        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
        this.h5ShareInit();
    },
    
    onBtnReturnClicked:function(){
        cc.director.loadScene('NewHallScene');
    },

    showSayWithMsg:function(chair,msg){
        if(msg.sayType == 100)
        {
            gameData.gamePlayerNode.showHeadFace(msg.chairBegin,msg.chairEnd,msg.index,msg.sex);
            return;
        }
        var curChair = confige.getCurChair(chair);
        
        if(msg.sayType == 255)
        {
            if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
            {
                var newYuyinData = {id:msg.id,chair:curChair.toString(),time:msg.time};
                this.addYuyinOnce(newYuyinData);
            }
            return;
        }

        var curString = "";

        if(msg.sayType == 0)
        {
            if(confige.loadFaceFrame == true)
            {
                console.log("someone say face！！！" + msg.index);
                gameData.gamePlayerNode.faceList[curChair].active = true;
                gameData.gamePlayerNode.faceList[curChair].getComponent("cc.Sprite").spriteFrame = confige.faceFrameMap[msg.index];
                gameData.gamePlayerNode.faceList[curChair].opacity = 255;
                gameData.gamePlayerNode.faceList[curChair].stopAllActions();
                gameData.gamePlayerNode.faceList[curChair].runAction(cc.sequence(cc.delayTime(1),cc.fadeOut(1.5)));
            } 
        }else if(msg.sayType == 1){
            console.log("someone say quick!!!!!" + msg.index + "sex ===" + msg.sex);
            console.log(this.quickStringList[msg.index]);
            curString = this.quickStringList[msg.index];
            if(confige.soundEnable == true)
            {
                confige.playSoundByName("chat_"+msg.index);
                // if(msg.sex == 2)
                // {
                //     confige.playSoundByName("female_chat_"+msg.index);
                // }else{
                //     confige.playSoundByName("male_chat_"+msg.index);
                // }
            }
        }else if(msg.sayType == 2){
            console.log("someone say:" + msg.string);
            curString = msg.string;
        }
        
        if(msg.sayType > 0)
        {
            gameData.gamePlayerNode.sayBoxList[curChair].active = true;
            gameData.gamePlayerNode.sayBoxLabelList[curChair].string = curString;
            gameData.gamePlayerNode.sayBoxList[curChair].width = gameData.gamePlayerNode.sayBoxLabelNodeList[curChair].width + 40;
            // gameData.gamePlayerNode.sayBoxLabelNodeList[curChair].x = gameData.gamePlayerNode.sayBoxList[curChair].width/2;

            gameData.gamePlayerNode.sayBoxList[curChair].opacity = 255;
            gameData.gamePlayerNode.sayBoxLabelNodeList[curChair].opacity = 255;
            gameData.gamePlayerNode.sayBoxLabelNodeList[curChair].stopAllActions();
            gameData.gamePlayerNode.sayBoxList[curChair].stopAllActions();
            gameData.gamePlayerNode.sayBoxList[curChair].runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(2)));
            gameData.gamePlayerNode.sayBoxLabelNodeList[curChair].runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(2)));
        }
    },

    btnClickFinish:function(event,customEventData){
        var clickIndex = parseInt(customEventData);
        if(clickIndex == 0)             //show
        {
            if(gameData.gameMainScene.gameBegin == true)
            {
                this.tipsLabel.string = "是否要发起解散房间请求！";
            }else{
                this.tipsLabel.string = "是否要退出房间回到大厅！";
            }
            this.tipsBox.active = true;
        }else if(clickIndex == 1) {     //send
            if(gameData.gameMainScene.gameBegin == true)
            {
                console.log("send finish");
                // pomelo.goldQuite();
                pomelo.request("connector.entryHandler.sendFrame", {"code" : "finish"}, function(data) {
                    console.log("finish flag is : "+ data.flag)
                });
            }else{
                console.log("send userQuit");
                // pomelo.goldQuite();
                pomelo.request("connector.entryHandler.sendFrame", {"code" : "userQuit"}, function(data) {
                    console.log("userQuit flag is : "+ data.flag)
                    if(data.flag == true)
                    {
                        cc.director.loadScene('NewHallScene');
                        if(confige.curGameScene.gameInfoNode.yuyinTimeOut != -1)
                            clearTimeout(confige.curGameScene.gameInfoNode.yuyinTimeOut);
                        confige.curGameScene.destroy();
                        confige.resetGameData();
                        if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
                        {
                            confige.GVoiceCall.quitRoom(confige.GVoiceRoomID);
                            confige.GVoiceCall.closeListen();
                        }
                    }
                });
            }
            this.tipsBox.active = false;
        }else if(clickIndex == 2) {      //hide
            this.tipsBox.active = false;
        }        
    },

    h5ShareInit:function(){
        cc.log("邀请好友");
        var curShareURL = "http://nnapi.5d8d.com/111?state=STATE";
        var urlStateString = "2R"+confige.roomData.roomId;
        curShareURL = curShareURL.replace("STATE", urlStateString);
        console.log("curShareURL===============");
        console.log(curShareURL);
                wx.onMenuShareAppMessage({
                    title: confige.shareTitle,
                    desc: confige.shareDes,
                    link: curShareURL,
                    imgUrl: "",
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

    btnInviteFriend:function(){
        cc.log("邀请好友");
        // var curTitle = "快打开我爱牛牛和我一块玩吧~";
        var curTitle = ""
        if(confige.roomData.gameMode == 1)
            curTitle += "【普通牛牛】,";
        else if(confige.roomData.gameMode == 3)
            curTitle += "【斗公牛】,";
        else if(confige.roomData.gameMode == 4)
            curTitle += "【通比牛牛】,";
        else if(confige.roomData.gameMode == 6)
            curTitle += "【疯狂加倍】,";
        else{
            if(confige.roomData.gameType == "zhajinniu"){
                curTitle += "【炸金牛】,";
            }else if(confige.roomData.gameType == "mingpaiqz"){
                curTitle += "【明牌抢庄】,";
            }else if(confige.roomData.roomType == "sanKung"){
                curTitle += "【三公】,";
            }else if(confige.roomData.roomType == "zhajinhua"){
                curTitle += "【炸金花】,";
            }
        }
        curTitle += "房间号:" + confige.roomData.roomId;

        var curDes = "";
            if(confige.roomData.roomType == "zhajinniu"){
                curDes += "底分" + confige.roomData.basic + ",";
            }else if(confige.roomData.roomType == "mingpaiqz"){
                switch(confige.roomData.basicType)
                {
                    case 1:
                        curDes += "底分1/2,";
                        break;
                    case 2:
                        curDes += "底分2/4,";
                        break;
                    case 3:
                        curDes += "底分4/8,";
                        break;
                    case 4:
                        curDes += "底分1/3/5,";
                        break;
                    case 5:
                        curDes += "底分2/4/6,";
                        break;
                }
            }else if(confige.roomData.roomType == "zhajinhua"){
                switch(confige.roomData.basic)
                {
                    case 1:
                        curDes += "底分1,";
                        break;
                    case 2:
                        curDes += "底分2,";
                        break;
                    case 5:
                        curDes += "底分5,";
                        break;
                }
                var curMaxBet = confige.roomData.maxBet;
                curDes += "最大单注"+curMaxBet+",";
                var curMaxRound = confige.roomData.maxRound;
                curDes += "轮数上限"+curMaxRound+",";
                switch(confige.roomData.stuffyRound)
                {
                    case 0:
                        curDes += "不闷牌,";
                        break;
                    case 1:
                        curDes += "闷1轮,";
                        break;
                    case 2:
                        curDes += "闷2轮,";
                        break;
                    case 3:
                        curDes += "闷3轮,";
                        break;
                }
            }

        curDes += confige.roomData.maxGameNumber + "局,";

        if(confige.roomData.cardMode == 1)
            curDes += "暗牌,";
        else if(confige.roomData.cardMode == 2)
            curDes += "明牌,"

        if(confige.roomData.gameMode == 1)
        {
            if(confige.roomData.bankerMode == 1)
                curDes += "随机抢庄,";
            else if(confige.roomData.bankerMode == 2)
                curDes += "房主坐庄,";
            else if(confige.roomData.bankerMode == 3)
                curDes += "轮流坐庄,";
            else if(confige.roomData.bankerMode == 5)
                curDes += "牛牛坐庄,";
            else if(confige.roomData.bankerMode == 6)
                curDes += "9点坐庄,";
        }
        curDes += "大家快来玩吧!";

        console.log(curTitle + curDes);

        this.btn_inviteFriend.interactable = false;

        if(confige.curUsePlatform == 1)
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", curTitle, curDes, confige.shareURL, 0);
        else if(confige.curUsePlatform == 2)
            jsb.reflection.callStaticMethod("JSCallOC", "WXShareTitle:andDes:andUrl:andType:",curTitle, curDes, confige.shareURL, 0);

        if(confige.curUsePlatform == 3)
        {
            var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', confige.roomData.roomId);
            if(confige.h5InviteCode != "0")
            {
                curShareURL += "&invite_code=" + confige.h5InviteCode;
            }
            wx.ready(function(res) {
                console.log("H5分享给好友");
                wx.onMenuShareAppMessage({
                    title: curTitle,
                    desc: curDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
                console.log("H5分享到朋友圈2222222");
                wx.onMenuShareTimeline({
                    title: curTitle,
                    desc: curDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
            });
            this.h5ShareNode.active = true;
            this.h5ShareNode.stopAllActions();
            this.h5ShareNode.opacity = 255;
            var deactiveCall = cc.callFunc(function () {
                this.h5ShareNode.active = false;
            },this);  
            this.h5ShareNode.runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(1),deactiveCall));
        }

        var newCallBack = function(){
            newCallBack.btn.interactable = true;
        };
        newCallBack.btn = this.btn_inviteFriend;
        setTimeout(newCallBack,300);
    },
    
    showReConnect:function(){
        this.webCloseLayer.showLoading();
    },

    hideReConnect:function(){
        this.webCloseLayer.hideLoading();
    },
    
    // hideUserInfoLayer:function(){
    //     this.selectHead = -1;
    //     this.userInfoLayer.active = false;
    // },

    // btnClickHeadFace:function(event,customEventData){
    //     var index = parseInt(customEventData);
    //     if(this.selectHead != -1)
    //         pomelo.clientSend("say",{"msg": {"sayType":100, "chairBegin":gameData.gameMainScene.meChair, "chairEnd":this.selectHead,"index":index,"sex":confige.curSex}});
    //     this.hideUserInfoLayer();
    // },

    btnClickRefresh:function(){
        confige.curReconnectType = confige.ON_OVER;
        confige.curGameScene.destroy();
        confige.resetGameData();
        if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
        {
            confige.GVoiceCall.quitRoom(confige.GVoiceRoomID);
            confige.GVoiceCall.closeListen();
        }
        confige.curReconnectType = confige.ON_HALL;
        pomelo.disconnect();
        if(confige.curUsePlatform == 3){
            window.open(confige.h5LoginUrl);
            window.close();
        }
    },

    sayWithID:function(voiceID){
        pomelo.clientSend("say",{"msg": {"sayType":255, "id": voiceID, "time": this.sayTime}});
    },

    closeMusicAndSound:function(){
        if(confige.musicEnable == true)
            cc.audioEngine.pause(confige.audioBgId);

        if(confige.soundEnable == true)
            cc.audioEngine.pauseAll();
    },

    openMusicAndSound:function(){
        if(confige.musicEnable == true)
            cc.audioEngine.resume(confige.audioBgId);
        if(confige.soundEnable == true)
            cc.audioEngine.resumeAll();
    },

    beginSayTime:function(){
        this.sayTime = 0;
        var self = this;
        this.sayTimeSchedule = function(){
            self.sayTime += 0.1;
        };
        this.schedule(this.sayTimeSchedule,0.1);
    },

    endSayTime:function(){
        this.unschedule(this.sayTimeSchedule);
    },

    addYuyinOnce:function(data){
        if(data)
        {
            this.yuyinList.push(data);
        }

        if(this.yuyinPaly == true)
        {
            return;
        }else{
            this.playYuyin();
        }
        
    },

    playYuyin:function(){
        
    },

    hideH5ShareNode:function(){
        this.h5ShareNode.stopAllActions();
        this.h5ShareNode.opacity = 0;
        this.h5ShareNode.active = false;
    },

    onBtnPopBankerClicked:function(){
        pomelo.clientSend("downBanker");
    },

    onBtnShowLayer:function(event, customEventData,callBack){
        var index = parseInt(customEventData);
        var self = this;
        switch(index){
            case  0:
                if(self.chatLayer == -1){
                    if(self.chatLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/chatLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.chatLayer = newLayer.getComponent("chatLayer");
                            self.chatLayer.showLayer();
                            self.chatLayer.parent = self;
                        });
                        self.chatLayerLoad =true;
                    }
                }else{
                    self.chatLayer.showLayer();
                }
                break;
            case  1:
                if(self.settingLayer == -1){
                    if(self.settingLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/settingLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.settingLayer = newLayer.getComponent("settingLayer");
                            self.settingLayer.showLayer();
                            self.settingLayer.parent = self;
                        });
                        self.settingLayerLoad =true;
                    }
                }else{
                    self.settingLayer.showLayer();
                }
                break;
            case  2:
                if(self.ruleLayer == -1){
                    if(self.ruleLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/ruleLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.ruleLayer = newLayer.getComponent("ruleLayer");
                            self.ruleLayer.showLayer();
                            self.ruleLayer.parent = self;

                            if(callBack)
                                callBack();
                        });
                        self.ruleLayerLoad =true;
                    }
                }else{
                    self.ruleLayer.showLayer();
                    if(callBack)
                            callBack();
                }
                break;
            case  3:
                if(self.tipsLayer == -1){
                    if(self.tipsLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/tipsLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.tipsLayer = newLayer.getComponent("tipsLayer");
                            self.tipsLayer.showLayer();
                            self.tipsLayer.parent = self;
                            if(callBack)
                                callBack();
                        });
                        self.tipsLayerLoad =true;
                    }
                }else{
                    self.tipsLayer.showLayer();
                    if(callBack)
                        callBack();
                }
                break;
            case 4:
                cc.director.loadScene('hallScene');
                confige.curGameScene.destroy();
                confige.resetGameData();
                break;
        };
    },

    onServerShowFinish:function(data){
        console.log("onServerShowFinish()");
        console.log(confige.roomPlayer);
        console.log(gameData.gameMainScene.gamePlayerNode.newPlayerCount);
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                var userNick = confige.roomPlayer[i].playerInfo.nickname;
                this.finishLayer.setPlayerName(i,userNick);
            }
        }
        this.finishLayer.showPlayer(gameData.gameMainScene.gamePlayerNode.newPlayerCount);
        this.finishLayer.runTime(180);
        this.finishLayer.showFinishLayer();
        if(data)
        {
            for(var i in data)
            {
                var newData = {chair: parseInt(i),result: data[i]};
                this.onServerResponseFinish(newData);
            }
            // this.finishLayer.hideTime();
        }
    },

    onServerResponseFinish:function(data){
        if(this.finishLayer == -1) return;
        if(data.chair == gameData.gameMainScene.meChair)
            this.finishLayer.hideAllBtn();
        var curType = 0;
        if(data.result == true)
            curType = 1;
        else if(data.result == false)
            curType = 2;
        this.finishLayer.setPlayerType(data.chair,curType);
    },

    onServerEndFinish:function(){
        if(this.finishLayer == -1) return;
        this.finishLayer.hideFinishLayer();
    },

    showOverLayer:function(data){
        var self = this;
        var overCallFunc = function(){
            console.log("overLayer.overCallFunc");
            if(self.overLayer == -1){
                cc.loader.loadRes("prefabs/game/overLayer", cc.Prefab, function (err, prefabs) {
                    var newLayer = cc.instantiate(prefabs);
                    self.layerNode2.addChild(newLayer,10);
                    self.overLayer = newLayer.getComponent("overLayer");
                    self.overLayer.showLayer();
                    self.overLayer.parent = self;
                    self.overLayer.showOverWithData(data);
                });
            }else{
                self.overLayer.showLayer();
                self.overLayer.showOverWithData(data);
            }
        };
        if(gameData.gameMainScene.waitForSettle == true && this.settleLayer != -1)
                this.settleLayer.overCallBack = overCallFunc;
        else
            overCallFunc();
    },

    check_inviteCode:function(){
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();
        var httpCallback = function(){
            if (xmlHttp.readyState==4)
            {// 4 = "loaded"
                if (xmlHttp.status==200)
                {// 200 = OK
                  var curReturn = JSON.parse(xmlHttp.responseText);
                  console.log(curReturn);
                  if(curReturn.errcode == 0){
                        confige.h5InviteCode = curReturn.invite_code;
                        console.log("invite_code ===" + curReturn.invite_code);
                  }else{
                        console.log("invite_code ===0000");
                  }
                  self.h5ShareInit();
                }
            }
            
        };

        this.scheduleOnce(function() {
            var url = "http://pay.5d8d.com/niu_admin.php/Api/getInviteCode?game_uid="+confige.userInfo.playerId;
            console.log("url====="+ url);
            xmlHttp.onreadystatechange = httpCallback;
            xmlHttp.open("GET", url, true);// 异步处理返回   
            xmlHttp.setRequestHeader("Content-Type",  
                    "application/x-www-form-urlencoded;");  
            xmlHttp.send();
        }, 0.1);
    },

    createXMLHttpRequest:function() {  
        var xmlHttp;  
        if (window.XMLHttpRequest) {  
            xmlHttp = new XMLHttpRequest();  
            if (xmlHttp.overrideMimeType)  
                xmlHttp.overrideMimeType('text/xml');  
        } else if (window.ActiveXObject) {  
            try {  
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {  
                try {  
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
                } catch (e) {  
                }  
            }  
        } 
        return xmlHttp;  
    },

});
