var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.sceneType = confige.h5GiftSceneType;     //0:sendLayer;1:giftLayer;2:giftHistory;

        this.sendLayer = this.node.getChildByName("sendLayer");
        this.giftLayer = this.node.getChildByName("giftLayer");
        this.giftHistory = this.node.getChildByName("giftHistory");

        this.curSendNum = 0;
        this.curGetNum = 0;
        this.curCardData = {};

        this.initLayer();

        var self = this;
        if(confige.h5CardID != "0")
        {
            self.sendLayer.active = false;
            pomelo.request("connector.redPacket.queryRedPacket", {"redId" : confige.h5CardID}, function(data) {
                console.log(data);
                self.curCardData = data;
                if(data.state == true)
                {
                    self.giftLayer.active = true;
                    self.sceneType = 1;
                }else{
                    self.giftHistory.active = true;
                    self.sceneType = 2;
                }
                self.updateUserInfo();
            });
        }else{
            self.sendLayer.active = true;
            self.sceneType = 0;
        }
        
    },

    editBoxChange:function(){
        console.log(this.editBox.string);
        if(this.editBox.string.substring(0,1) == "0")
            this.editBox.string = 0;

        this.sendNumMin.string = this.editBox.string;
        this.curSendNum = parseInt(this.editBox.string);
        console.log("this.curSendNum===="+this.curSendNum);
        if(!this.curSendNum)
        {
            console.log("this.curSendNum====nanananana");
            this.sendNumMin.string = 0;
            this.curSendNum = 0;
            this.sendNum.string = 0;
            return;
        }
        if(this.curSendNum > confige.curDiamond)
        {
            console.log("红包数目大于自身数目，重置");
            this.curSendNum = 0;
            this.editBox.string = "";
            this.sendNumMin.string = 0;
        }else{
            console.log("红包数目小于自身数目，可以赠送");
        }
        this.sendNum.string = this.curSendNum;
    },

    initLayer:function() {
        // if(this.sceneType == 0)
        // {
            this.cardNum = this.sendLayer.getChildByName("cardNum").getComponent("cc.Label");   //你的房卡：3张
            this.sendNum = this.sendLayer.getChildByName("sendNum").getComponent("cc.Label");

            this.sendNumMin = this.sendLayer.getChildByName("sendNumMin").getComponent("cc.Label");
            this.editBox = this.sendLayer.getChildByName("editBox").getComponent("cc.EditBox");

            this.cardNum.string = "你的房卡："+ confige.curDiamond +"张";
        // }else if(this.sceneType == 1){
            this.giftHead = this.giftLayer.getChildByName("head").getComponent("cc.Sprite");
            this.giftName = this.giftLayer.getChildByName("name").getComponent("cc.Label");
        // }else if(this.sceneType == 2){
            this.historyHead = this.giftHistory.getChildByName("head").getComponent("cc.Sprite");
            this.historyHeadMin = this.giftHistory.getChildByName("headMin").getComponent("cc.Sprite");
            this.historyTitle = this.giftHistory.getChildByName("title").getComponent("cc.Label");  //nick的房卡包
            this.historyNick = this.giftHistory.getChildByName("nick").getComponent("cc.Label");
            this.historyCardNum = this.giftHistory.getChildByName("cardNum").getComponent("cc.Label");  //1张房卡
            this.historyTime = this.giftHistory.getChildByName("time").getComponent("cc.Label");
        // }
    },

    updateUserInfo:function(){
        if(this.sceneType == 1)
        {
            confige.getWXHearFrameNoSave(this.curCardData.createUser.head,this.giftHead);
            this.giftName.string = this.curCardData.createUser.nickname;
        }
        if(this.sceneType == 2)
        {
            confige.getWXHearFrameNoSave(this.curCardData.createUser.head,this.historyHead);
            confige.getWXHearFrameNoSave(this.curCardData.createUser.head,this.historyHeadMin);
            this.historyTitle.string = this.curCardData.createUser.nickname + "的房卡包";
            this.historyNick.string = this.curCardData.createUser.nickname;
            this.historyCardNum.string = this.curCardData.value + "张房卡";
            var dayStr = confige.getDateDay(this.curCardData.createTime);
            dayStr = dayStr.substring(5,dayStr.length);
            this.historyTime.string = dayStr + "  " + confige.getDateTime(this.curCardData.createTime);
        }
    },

    btnSendCard:function(){
        console.log("createRedPacket sendNum ===== " + this.curSendNum);
        var self = this;
        pomelo.request("connector.redPacket.createRedPacket", {"diamond" : this.curSendNum}, function(data) {
            console.log("createRedPacket@@@@@");
            console.log(data);

            self.sendLayer.active = false;
            self.giftLayer.active = true;
            self.sceneType = 1;

            confige.h5CardID = data.id;
            self.curCardData = data;
            self.updateUserInfo();

            var curShareURL = "http://nnapi.5d8d.com/111?state=STATE";
            var urlStateString = "4C"+data.id;
            var curTitle = confige.userInfo.nickname + "送给您一个红包";
            var curDes = "请您查收";
            curShareURL = curShareURL.replace("STATE", urlStateString);
            console.log("curShareURL===============");
            console.log(curShareURL);
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
    },

    btnGetCard:function(){
        var self = this;
        pomelo.request("connector.redPacket.drawRedPacket", {"redId" : confige.h5CardID}, function(data) {
            console.log("drawRedPacket@@@@@@@@@@@@@");
            console.log(data);
            if(data == true)
            {
                self.giftLayer.active = false;
                self.giftHistory.active = true;
                self.sceneType = 2;
                self.updateUserInfo();
            }
        });
    },

    showLayer:function(){
        if(this.sceneType == 0)
            this.sendLayer.active = true;
        else if(this.sceneType == 1)
            this.giftLayer.active = true;
        else if(this.sceneType == 2)
            this.giftHistory.active = true;
    },

});
