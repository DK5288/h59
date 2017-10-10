var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.initUserInfo();
        this.initCheckLayer();
    },

    initUserInfo:function(){
        this.userInfoNode = this.node.getChildByName("uiNode").getChildByName("userInfo");
        this.headSprite = this.userInfoNode.getChildByName("headImg").getComponent("cc.Sprite");
        this.cardNumLabel = this.userInfoNode.getChildByName("cardNum").getComponent("cc.Label");
        this.nicknameLabel = this.userInfoNode.getChildByName("nickname").getComponent("cc.Label");

        this.btnCheck = this.userInfoNode.getChildByName("btnCheck");
        // this.cardNumLabel.string = confige.curDiamond + "张";
        // this.nicknameLabel.string = confige.userInfo.nickname;
        confige.getWXHearFrameNoSave(confige.userInfo.head,this.headSprite);
        
        this.cardNumLabel.string = confige.curDiamond + "张";
        this.nicknameLabel.string = confige.userInfo.nickname;
        this.phoneNumLabel = this.userInfoNode.getChildByName("phoneNum").getComponent("cc.Label");
        if(confige.userInfo.phone != "0")
        {
            this.btnCheck.active = false;
            this.phoneNumLabel.string = confige.userInfo.phone;
        }
    },

    initCheckLayer:function(){
        this.checkNode = this.node.getChildByName("checkNode");

        this.sendCheckOnCD = false;
        // this.curPhoneNum = 0;
        this.curPhoneNumCount = 0;
        // this.checkNum = 0;
        this.checkNumCount = 0;

        this.editBox1 = this.checkNode.getChildByName("editBox1").getComponent("cc.EditBox");
        this.editBox2 = this.checkNode.getChildByName("editBox2").getComponent("cc.EditBox");

        this.btnSendCheckNum = this.checkNode.getChildByName("btnSend").getComponent("cc.Button");
        this.btnSendLink = this.checkNode.getChildByName("btnLink").getComponent("cc.Button");
        this.sendCheckCDTimeLabel = this.checkNode.getChildByName("btnSend").getChildByName("time").getComponent("cc.Label");
        this.sendCheckCDTime = 0;
    },

    editBox1Change:function(){
        console.log("this.editBox1==="+this.editBox1.string);
        this.curPhoneNumCount = this.editBox1.string.length;
        console.log("curLength==="+this.curPhoneNumCount);
        if(this.curPhoneNumCount == 11)
        {
            this.btnSendCheckNum.interactable = true;
        }else{
            this.btnSendCheckNum.interactable = false;
        }
    },

    editBox2Change:function(){
        console.log("this.editBox2==="+this.editBox2.string);
        this.checkNumCount = this.editBox2.string.length;
        console.log("curLength==="+this.checkNumCount);
    },

    btnCheckLayerClick:function(event, customEventData){
        console.log("btnCheckLayerClick==="+customEventData);
        console.log(customEventData);
        var index = parseInt(customEventData);
        if(index == 0){
            this.checkNode.active = true;
        }else if(index == 1) {
            //getCheckNum
            if(this.curPhoneNumCount == 11 && this.sendCheckOnCD == false)
            {
                console.log("12321312321")
                var self = this;
                pomelo.request("connector.entryHandler.getCaptcha", {"phone" : this.editBox1.string}, function(data) {
                    console.log(data);
                    console.log("flag is : "+data.flag)
                    if(data.flag == true){
                        self.sendCheckOnCD = true;
                        self.sendCheckCDTime = 60;
                        self.sendCheckCDTimeLabel = "("+self.sendCheckCDTime+"s)";
                        var callFunc = function(){
                            self.sendCheckCDTime -- ;
                            self.sendCheckCDTimeLabel = "("+self.sendCheckCDTime+"s)";
                            if(self.sendCheckCDTime <= 0)
                            {
                                self.sendCheckCDTimeLabel = "";
                                if(self.curPhoneNumCount == 11)
                                    self.btnSendCheckNum.interactable = true;
                                self.sendCheckOnCD = false;
                            }
                        };
                        self.schedule(callFunc,1);
                        // self.scheduleOnce(function() {
                        //     if(self.curPhoneNumCount == 11)
                        //         self.btnSendCheckNum.interactable = true;
                        //     self.sendCheckOnCD = false;
                        // }, 60);
                    }
                });
            }
            
        }else if(index == 2){
            //sendCheck
            var self = this;
            if(this.curPhoneNumCount == 11 && this.checkNumCount != 0)
            {
                pomelo.request("connector.entryHandler.bindPhone", {"code" : this.editBox2.string}, function(data) {
                    console.log("flag is : "+data.flag);
                    console.log(data);
                    if(data.flag == true){
                        // if(confige.userInfo.phone != "0")
                        // {
                            self.checkNode.active = false;
                            self.btnCheck.active = false;
                            // self.phoneNumLabel.string = confige.userInfo.phone;
                        // }
                    }
                });
            }
        }else if(index == 3){
            //closeLayer
            this.checkNode.active = false;
            this.editBox1.string = "";
            this.editBox2.string = "";
            this.btnSendCheckNum.interactable = true;
        }
    },

    btnSendClick:function(){
        cc.director.loadScene('giftScene');
    },
     // //获取验证码
     //  var getCaptcha = function(phone) {
     //      pomelo.request("connector.entryHandler.getCaptcha", {"phone" : phone}, function(data) {
     //          console.log("flag is : "+data.flag)
     //        }
     //      );        
     //  }
      //绑定手机
      // var bindPhone = function(code) {
      //     pomelo.request("connector.entryHandler.bindPhone", {"code" : code}, function(data) {
      //         console.log("flag is : "+data.flag)
      //       }
      //     )
      // }
});
