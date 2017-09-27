var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization

    onLoad: function () {
        // cc.loader.onProgress = function(){};
        confige.loadNode.hideNode();

        this.topNode = this.node.getChildByName("topNode");
        this.bottomNode = this.node.getChildByName("bottomNode");

        this.btn_addDiamond = this.topNode.getChildByName("btn_addDiamond").getComponent("cc.Button");
        this.btn_addDiamond.interactable = true;
        this.btn_exit = this.bottomNode.getChildByName("btn_exit").getComponent("cc.Button");


        if(cc.sys.platform == cc.sys.IPAD)
            cc.view.setDesignResolutionSize(1280,720,cc.ResolutionPolicy.EXACT_FIT);
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
        {
            this.bgNode = this.node.getChildByName("hallBg");
            this.bgNode.height = 790;
            cc.view.setDesignResolutionSize(1280,790,cc.ResolutionPolicy.EXACT_FIT);
            this.h5ShareNode = this.node.getChildByName("h5Share");
            this.h5ShareNode.opacity = 0;
            this.h5ShareNode.active = false;
            this.check_inviteCode();

            
            this.btn_exit.interactable = false;
            this.topNode.getChildByName("btn_addDiamond").active = false;
            confige.oriPaomaText = "和谐游戏，拒绝赌博，如若发现，封号并提交公安机关处理。";
        }

        
        console.log("fuck hall on load!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        pomelo.clientScene = this;
        confige.curGameScene = this;
        confige.curSceneIndex = 1;
        
        this.player = this.bottomNode.getChildByName("Player").getComponent("playerInfo");
        this.player.onInit();
        
        this.player.setName(confige.userInfo.nickname);
        this.player.setScore(confige.curDiamond);
        this.diamondNum = this.topNode.getChildByName("diamondNum").getComponent("cc.Label");
        this.diamondNum.string = confige.curDiamond;
        if(confige.meWXHeadFrame != -1)
        {
            cc.log("fuck change head img");
            this.player.setHeadSpriteFrame(confige.meWXHeadFrame);
        }
        this.playerID = this.bottomNode.getChildByName("Player").getChildByName("id").getComponent("cc.Label");
        this.playerID.string = confige.userInfo.playerId;

        this.paoma = this.topNode.getChildByName("paoma").getChildByName("content").getChildByName("New Label");
        this.paomaLabel = this.paoma.getComponent("cc.Label")
        this.paomaOriText = confige.oriPaomaText;
        this.paomaLabel.string = this.paomaOriText;
        this.paomaTextList = [];
        this.paomaAddOneText(-1);

        this.noticeLayer = this.node.getChildByName("noticeLayer").getComponent("noticeLayer");
        this.noticeLayer.onInit();

        this.tipsBox = this.node.getChildByName("tipsBox");
        this.tipsBoxLabel = this.tipsBox.getChildByName("tips").getComponent("cc.Label");  
        // if(confige.curUsePlatform == 1 || confige.curUsePlatform == 2)
        // {
            
        // }

        this.btn_invite = this.bottomNode.getChildByName("btn_invite").getComponent("cc.Button");
        if(confige.loginType == 1 || confige.loginType == 2)
            this.check_invite();
        if(cc.sys.localStorage.getItem('check_invite') == false)
            this.btn_invite.interactable = false;

        if(confige.playerLimits >= 1)
        {
            this.btn_gift = this.bottomNode.getChildByName("btn_gift");
            this.btn_gift.active = true;
        }
        
        this.loadingLayer = this.node.getChildByName("loadingLayer").getComponent("loadingLayer");
        this.loadingLayer.onInit();

        this.webCloseLayer = this.node.getChildByName("webCloseLayer").getComponent("loadingLayer"); 
        this.webCloseLayer.onInit();

        this.shareMask = this.node.getChildByName("shareMask");
        this.shareMask.active = false;
        
        this.layerNode = this.node.getChildByName("layerNode");

        if(confige.h5RoomID != "0"){
            var roomId = parseInt(confige.h5RoomID);
            var self = this;
            var joinCallFunc = function(){
                console.log("onBtnJoinRoom joinCallFunc!!!!!");
                self.loadingLayer.showLoading();
            };
            pomelo.clientSend("join",{"roomId":roomId}, joinCallFunc);
            console.log("join room" + roomId);
            confige.h5RoomID = "0";
        }
        console.log("分享路径111111===="+confige.h5ShareUrlNew);

        this.inviteLayer = -1;
        this.createLayer = -1;
        this.joinLayer = -1;
        this.helpLayer = -1;

        this.settingLayer = -1;
        this.historyLayer = -1;
        this.shareLayer = -1;
        this.giftLayer = -1;
        this.roomInfoLayer = -1;

        this.inviteLayerLoad = false;
        this.createLayerLoad = false;
        this.joinLayerLoad = false;
        this.helpLayerLoad = false;

        this.settingLayerLoad = false;
        this.historyLayerLoad = false;
        this.shareLayerLoad = false;
        this.giftLayerLoad = false;
        this.roomInfoLayerLoad = false;
    },
    
    start:function(){
        console.log("fuck hallscene start");
        //pomelo.request("connector.entryHandler.test",null,null);

        if(confige.firstShowNotice == true)
        {
            console.log("fuck firstShowNotice!!!!!!!");
            this.onBtnShowNotice();
            confige.firstShowNotice = false;
            var curDate = new Date();
            var lastLoginDate = {
                year : curDate.getFullYear(),
                month : curDate.getMonth() + 1,
                day : curDate.getDate()
            }
            cc.sys.localStorage.setItem('lastLoginDate', JSON.stringify(lastLoginDate));
        }

        var infoCount = confige.hallSceneLoadData.length;
        console.log(confige.hallSceneLoadData);
        for(var i=0;i<infoCount;i++)
        {
            console.log("deal once!!!!!!!!");
            var curInfo = confige.hallSceneLoadData.shift();
            pomelo.dealWithOnNotify(curInfo);
            console.log(curInfo);
        }
        confige.hallSceneLoadData = [];
    },

    paomaAddOneText:function(textData,paomaTime){
        if(textData != -1)
        {
            this.paomaTextList.push(textData);
            this.paoma.x = 500;
            this.paomaLabel.string = textData;
            console.log("curPaomaString = " + textData);
            this.paoma.stopAllActions();
        }

        var paomaCurMoveX = -(this.paoma.width + 500 + 700);
        var paomaCurMoveT = 15;
        var paomaCurMove = cc.moveBy(paomaCurMoveT, paomaCurMoveX, 0);

        var finished = function(){//cc.callFunc(function () {
            if(this.paomaTextList.length == 0)
            {
                this.paomaLabel.string = this.paomaOriText;
            }else{
                this.paomaLabel.string = this.paomaTextList[this.paomaTextList.length-1];
                this.paomaTextList.pop();
            }
            this.paoma.x = 500;
            paomaCurMoveX = -(this.paoma.width + 500 + 700);
            paomaCurMoveT = (-paomaCurMoveX) / 200 + 2;
            if(paomaCurMoveT < 10)
                paomaCurMoveT = 10;
            if(paomaTime)
            {
                var setX = cc.callFunc(function () {
                    this.paoma.x = 500;
                },this);
                var moveAction = cc.moveBy(paomaCurMoveT, paomaCurMoveX, 0);
                paomaCurMove = cc.repeat(cc.sequence(setX, moveAction), paomaTime);
            }else{
                paomaCurMove = cc.moveBy(paomaCurMoveT, paomaCurMoveX, 0);
            }
            //console.log("curMoveX = " + this.paomaCurMoveX + "      curMoveT = " + this.paomaCurMoveT);
        }.bind(this);//, this);
        
        finished();

        var paomaCallFunc = cc.callFunc(function () {
            this.paoma.stopAllActions();
            finished();
            this.paoMaSeq = cc.sequence(
                paomaCurMove,
                paomaCallFunc
            );
            this.paoma.runAction(this.paoMaSeq);
            //console.log("newnewnew    curMoveX = " + this.paomaCurMoveX + "      curMoveT = " + this.paomaCurMoveT);
        },this);     

        this.paoMaSeq = cc.sequence(
            paomaCurMove,
            paomaCallFunc
        );
        this.paoma.runAction(this.paoMaSeq);
    }, 

    onBtnShowLayer:function(event, customEventData){
        // this.inviteLayer = this.node.getChildByName("inviteLayer");
        // this.createLayer = this.node.getChildByName("createLayer");
        // this.joinRoomLayer = this.node.getChildByName("joinLayer");
        // this.helpLayer = this.node.getChildByName("helpLayer");

        // this.settingLayer = this.node.getChildByName("settingLayer");
        // this.settingLayer.onInit();
        // this.historyLayer = this.node.getChildByName("historyLayer");
        // this.shareLayer = this.node.getChildByName("shareLayer");
        // this.giftLayer = this.node.getChildByName("giftLayer");
        // this.roomInfoLayer = this.node.getChildByName("roomInfoLayer");
        var index = parseInt(customEventData);
        var self = this;
        switch(index){
            case  0:
                if(self.createLayer == -1){
                    if(self.createLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/createLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.createLayer = newLayer.getComponent("createLayer");
                            self.createLayer.showLayer();
                            self.createLayer.parent = self;
                        });
                        self.createLayerLoad = true;
                    }
                }else{
                    self.createLayer.showLayer();
                }
                break;
            case  1:
                if(self.joinLayer == -1){
                    if(self.joinLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/joinLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.joinLayer = newLayer.getComponent("joinLayer");
                            self.joinLayer.showLayer();
                            self.joinLayer.parent = self;
                        });
                        self.joinLayerLoad = true;
                    }
                }else{
                    self.joinLayer.showLayer();
                }
                break;
            case  2:
                if(self.roomInfoLayer == -1){
                    if(self.roomInfoLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/roomInfoLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.roomInfoLayer = newLayer.getComponent("roomInfoLayer");
                            self.roomInfoLayer.showLayer();
                            self.roomInfoLayer.parent = self;
                        });
                        self.roomInfoLayerLoad = true;
                    }
                }else{
                    self.roomInfoLayer.showLayer();
                }
                break;
            case  3:
                if(self.shareLayer == -1){
                    if(self.shareLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/shareLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.shareLayer = newLayer.getComponent("shareLayer");
                            self.shareLayer.showLayer();
                            self.shareLayer.parent = self;
                        });
                        self.shareLayerLoad = true;
                    }
                }else{
                    self.shareLayer.showLayer();
                }
                break;
            case  4:
                if(self.historyLayer == -1){
                    if(self.historyLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/historyLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.historyLayer = newLayer.getComponent("historyLayer");
                            self.historyLayer.showLayer();
                            self.historyLayer.parent = self;
                        });
                        self.historyLayerLoad = true;
                    }
                }else{
                    self.historyLayer.showLayer();
                }
                break;
            case  5:
                this.onBtnShowNotice();
                break;
            case  6:
                if(self.inviteLayer == -1){
                    if(self.inviteLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/inviteLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.inviteLayer = newLayer.getComponent("inviteLayer");
                            self.inviteLayer.showLayer();
                            self.inviteLayer.parent = self;
                        });
                        self.inviteLayerLoad = true;
                    }
                }else{
                    self.inviteLayer.showLayer();
                }
                break;
            case  7:
                if(self.helpLayer == -1){
                    if(self.helpLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/helpLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.helpLayer = newLayer.getComponent("helpLayer");
                            self.helpLayer.showLayer();
                            self.helpLayer.parent = self;
                        });
                        self.helpLayerLoad = true;
                    }
                }else{
                    self.helpLayer.showLayer();
                }
                break;
            case  8:
                if(self.settingLayer == -1){
                    if(self.settingLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/settingLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.settingLayer = newLayer.getComponent("settingLayer");
                            self.settingLayer.showLayer();
                            self.settingLayer.parent = self;
                        });
                        self.settingLayerLoad = true;
                    }
                }else{
                    self.settingLayer.showLayer();
                }
                break;
            case  9:
                this.onBtnGameExit();
                break;
            case  10:
                if(self.giftLayer == -1){
                    if(self.giftLayerLoad == false)
                    {
                        cc.loader.loadRes("prefabs/hall/giftLayer", cc.Prefab, function (err, prefabs) {
                            var newLayer = cc.instantiate(prefabs);
                            self.layerNode.addChild(newLayer);
                            self.giftLayer = newLayer.getComponent("giftLayer");
                            self.giftLayer.showLayer();
                            self.giftLayer.parent = self;
                        });
                        self.giftLayerLoad = true;
                    }
                }else{
                    self.giftLayer.showLayer();
                }
                break;
        };
    },

    onBtnShowUserInfo:function(){
    },

    onBtnShowNotice:function(){
        var self = this;
        pomelo.request("connector.entryHandler.getNotify",null, function(data) {
            confige.noticeData = data;
            console.log(data);
            self.noticeLayer.addNotice(data);
            self.noticeLayer.showLayer();
        });
    },

    onBtnGameExit:function(event, customEventData){   
        if(confige.curUsePlatform == 3){
            confige.curGameScene.destroy();
            window.close();
        }
        cc.director.end();
        console.log("game exit->run()");
        if(confige.curUsePlatform == 2)
            jsb.reflection.callStaticMethod("JSCallOC","GameExit");
        //可能需要针对不同的平台做不同的处理，并且在end之前要向服务器发送下线
    },

    connectCallBack:function(){

    },

    hideH5ShareNode:function(){
        this.h5ShareNode.stopAllActions();
        this.h5ShareNode.opacity = 0;
        this.h5ShareNode.active = false;
    },

    showTips:function(newTips,type){
        this.tipsBoxLabel.string = newTips;
        this.tipsBox.active = true;
        this.tipsBox.opacity = 0;
        var tipsAction = cc.sequence(
            cc.fadeIn(0.5),
            cc.delayTime(3),
            cc.fadeOut(0.5)
        );
        this.tipsBox.runAction(cc.fadeIn(0.5));

        if(type == 1)           //创建成功,隐藏界面
        {
            this.createLayer.hideLayer();
        }else if(type == 2){    //加入失败,清空ID
            this.joinRoomLayer.cleanRoomId();
        }
    }, 

    hideTips:function(){
        this.tipsBox.stopAllActions();
        this.tipsBox.opacity = 0;
        this.tipsBox.active = false;
    },
    
    btnAddDiamond:function(){
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER)
            return;
            // window.open(confige.payURL);
        cc.sys.openURL(confige.payURL);
    },

    updateDiamond:function(){
        this.player.setScore(confige.curDiamond);
        this.diamondNum.string = confige.curDiamond;
    },

    update: function (dt) {
        confige.CallGVoicePoll();
    },

    check_invite:function(){
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();
        var httpCallback = function(){
            if (xmlHttp.readyState==4)
              {// 4 = "loaded"
              if (xmlHttp.status==200)
                {// 200 = OK
                    var curReturn = JSON.parse(xmlHttp.responseText);
                    console.log(curReturn);
                    if(curReturn.errcode == 0)
                        self.btn_invite.interactable = false;
                    else
                        self.onBtnShowLayer(6);
                }
              else
                {
                    console.log("Problem retrieving XML data");
                    self.btn_invite.interactable = false;
                }
              }
            
        };

        this.scheduleOnce(function() {
            var url = "http://pay.5d8d.com/niu_admin.php/Api/checkAgent?";
            url = url + "game_uid=" + confige.userInfo.playerId;
            // var md5String = ("game_uid=" + confige.userInfo.playerId + "&key=niuniuyiyousecretkey");
            // var data = {
            //     game_uid : confige.userInfo.playerId
            // }
            // data.sign = this.getMD5(md5String);
            // url += require("querystring").stringify(data);
            
            console.log("url====="+ url);
            xmlHttp.onreadystatechange = httpCallback;
            xmlHttp.open("GET", url, true);// 异步处理返回   
            xmlHttp.setRequestHeader("Content-Type",  
                    "application/x-www-form-urlencoded;");  
            xmlHttp.send();
        }, 0.25);
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

    getMD5:function (text) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "md511111111");
        var md5String = require('crypto').createHash('md5').update(text).digest('hex');
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "md52222222");
        return md5String;
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

    showReConnect:function(){
        console.log("hallScene showReConnect!!!");
        if(this.webCloseLayer && this.webCloseLayer.showLoading)
            this.webCloseLayer.showLoading();
    },

    hideReConnect:function(){
        if(this.webCloseLayer && this.webCloseLayer.hideLoading)
            this.webCloseLayer.hideLoading();
    },

    openShare:function(){
        this.shareMask.active = false;
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();
        if(this.shareLayer != -1)
        {
            this.shareLayer.shareBtn1.interactable = true;
            this.shareLayer.shareBtn2.interactable = true;
        }
    },

    WXCancle:function(){
        this.shareMask.active = false;
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();

        if(this.shareLayer != -1)
        {
            this.shareLayer.shareBtn1.interactable = true;
            this.shareLayer.shareBtn2.interactable = true;
        }
    },

    h5ShareInit:function(){
        var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', '0');
        if(confige.h5InviteCode != "0")
        {
            curShareURL += "&invite_code=" + confige.h5InviteCode;
        }
        console.log("H5分享给好友");
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