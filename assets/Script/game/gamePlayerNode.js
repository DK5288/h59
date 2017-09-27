var gameData = require("gameData");
var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    },
    
    onInit:function(){
        gameData.gamePlayerNode = this;
        this.playerMax = confige.playerMax;
        this.meChair = 0;
        this.noShowCardCount = 0;       //当前有多少人开牌
        this.playerCount = 0;           //当前参与游戏的人数,加入新玩家时该数字不会变,等新的一局开始时才会改变
        this.newPlayerCount = 0;
        this.playerList = {};
        for(var i=0;i<this.playerMax;i++)
        {
            this.playerList[i] = this.node.getChildByName("player"+i);
        }
        
        this.playerActiveList = {};
        this.playerCardList = {};
        this.playerHandCardList = {};
        this.playerNickList = {};
        this.playerScoreNumList = {};
        this.playerInfoList = {};
        this.playerHeadList = {};
        this.niuTypeBoxList = {};
        this.playerScoreList = {};
        for(var i=0;i<this.playerMax;i++)
        {
            this.playerActiveList[i] = false;
            this.playerScoreList[i] = 0;
            this.playerHandCardList[i] = this.playerList[i].getChildByName("handCard").getComponent("handCards");
            this.playerNickList[i] = this.playerList[i].getChildByName("nickname").getComponent("cc.Label");
            this.playerScoreNumList[i] = this.playerList[i].getChildByName("score").getComponent("cc.Label");
            this.playerHeadList[i] = this.playerList[i].getChildByName("headImg").getComponent("cc.Sprite");
            this.niuTypeBoxList[i] = this.playerList[i].getChildByName("niutypeNode");
        }
        this.playerNickList[0].string = confige.userInfo.nickname;
        this.playerScoreNumList[0].string = 0;

        this.betNumNodeList = {};
        this.betNumLabelList = {};
        this.curBetNumList = {};

        this.bankerImgList = {};
        this.readyImgList = {};
        this.noRobImgList = {};
        this.lightBgList = {};

        // this.leaveNodeList = {};
        this.robNumNodeList = {};
        this.robNumLabelList = {};
        
        this.scoreAddNodeList = {};
        this.scoreSubNodeList = {};
        this.scoreAddNumList = {};
        this.scoreSubNumList = {};
        for(var i=0;i<this.playerMax;i++)
        {
            this.readyImgList[i] = this.playerList[i].getChildByName("readyImg");
            this.bankerImgList[i] = this.playerList[i].getChildByName("bankerImg");
            this.noRobImgList[i] = this.playerList[i].getChildByName("noRobImg");
            this.lightBgList[i] = this.playerList[i].getChildByName("lightBg");

            // this.leaveNodeList[i] = this.playerList[i].getChildByName("leaveNode");
            this.robNumNodeList[i] = this.playerList[i].getChildByName("robNum");
            this.robNumLabelList[i] = this.robNumNodeList[i].getComponent("cc.Label");
            this.scoreAddNodeList[i] = this.playerList[i].getChildByName("scoreAdd");
            this.scoreSubNodeList[i] = this.playerList[i].getChildByName("scoreSub");
            this.scoreAddNumList[i] = this.scoreAddNodeList[i].getComponent("cc.Label");
            this.scoreSubNumList[i] = this.scoreSubNodeList[i].getComponent("cc.Label");
        }

        this.cardItemList = this.node.getChildByName("cardList").getComponent("cardList");
        this.cardItemList.onInit();
        
        this.selectHead = -1;

        this.sayBoxList = {};
        this.sayBoxLabelList = {};
        this.sayBoxLabelNodeList = {};
        this.sayNode = this.node.getChildByName("sayNode");
        
        for(var i=0;i<this.playerMax;i++)
        {
            this.sayBoxList[i] = this.sayNode.getChildByName("sayBox"+i);
            this.sayBoxLabelNodeList[i] = this.sayNode.getChildByName("sayLabel"+i);
            this.sayBoxLabelList[i] = this.sayNode.getChildByName("sayLabel"+i).getComponent("cc.Label");
        }
    },

    onStart:function(){
        this.initBankerAni();
        this.initGameCoinAni();
        console.log("gameScene Start!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        for(var i=0;i<this.playerMax;i++)
        {
            this.readyImgList[i].active = false;
            this.bankerImgList[i].active = false;
            this.noRobImgList[i].active = false;
            this.lightBgList[i].active = false;

            this.robNumNodeList[i].active = false;
            // this.robNumLabelList[i].active = false;
            this.niuTypeBoxList[i].active = false;
            
            this.sayBoxList[i].active = false;
            this.sayBoxLabelList[i].string = "";
            this.playerList[i].opacity = 255;
            this.playerList[i].active = false;
            this.scoreAddNodeList[i].active = false;
            this.scoreSubNodeList[i].active = false;
        }
        this.sayNode.active = true;
        //console.log(confige.roomPlayer);
        if(confige.roomPlayer != -1)
        {
            for(var i in confige.roomPlayer)
            {
                var newPlayerInfo = confige.roomPlayer[i];
                if(newPlayerInfo.uid == confige.userInfo.uid)
                {
                    this.meChair = parseInt(i);
                    gameData.gameMainScene.meChair = this.meChair;
                    confige.meChair = this.meChair;
                }
                confige.curPlayerMax ++;
            }
            for(var k in confige.roomPlayer)
            {
                if(confige.roomPlayer.hasOwnProperty(k))
                {
                    var curIndex = confige.getCurChair(parseInt(k));
                    var newPlayerInfo = confige.roomPlayer[k];
                    confige.curPlayerData[curIndex] = newPlayerInfo;
                    if(newPlayerInfo.isActive == true)
                    {
                        this.addOnePlayer(newPlayerInfo);
                        this.playerCount ++;
                        // if(newPlayerInfo.isOnline == false)
                        //     this.leaveNodeList[confige.getCurChair(k)].active = true;
                    }
                }
            }
        }
        
        // if(this.playerCount == 6)
            // gameData.gameMainScene.gameInfoNode.btn_inviteFriend.active = false;

        this.newPlayerCount = this.playerCount;
    },

    addOnePlayer:function(playerData){
        var curIndex = confige.getCurChair(playerData.chair);
        console.log("addOnePlayer!!!!!chair ===== " + curIndex);
        console.log(playerData);
        this.playerNickList[curIndex].string = playerData.playerInfo.nickname;
        this.playerScoreNumList[curIndex].string = playerData.score;
        this.playerScoreList[parseInt(playerData.chair)] = playerData.score;
        //
        var self = this;
        if(playerData.playerInfo.head != "")
        {
            confige.getWXHearFrameNoSave(playerData.playerInfo.head,this.playerHeadList[curIndex]);
            // var newCallBack = function(index){
            //     self.playerInfoList[index].setHeadSpriteFrame(confige.WXHeadFrameList[index+1]);
            // };
            // confige.getWXHearFrame(playerData.playerInfo.head, curIndex+1, function(curIndex){
            //     return function(){
            //         newCallBack(curIndex)
            //     } 
            // }(curIndex) );
        }
            
        if(playerData.isReady == true && confige.roomData.state == 1001)// confige.curReconnectData == -1 && )
        {
            this.readyImgList[curIndex].active = true;
            console.log("isReady.active = true");
        }else{
            console.log("isReady.active = false");
            this.readyImgList[curIndex].active = false;
        }
        this.playerList[curIndex].active = true;
        confige.roomPlayer[playerData.chair] = playerData;
        confige.curPlayerData[curIndex] = playerData;
        this.newPlayerCount ++;
        console.log("addOnePlayer() this.newPlayerCount ==== " + this.newPlayerCount);
        confige.curPlayerCount ++;

        // if(this.newPlayerCount == 6)
        //     gameData.gameMainScene.gameInfoNode.btn_inviteFriend.active = false;
        this.playerActiveList[curIndex] = true;

        // this.faceAniList = {};
        // this.faceAniNode = this.node.getChildByName("faceAniNode");
        // for(var i=1;i<=6;i++)
        //     this.faceAniList[i] = this.faceAniNode.getChildByName("faceAni"+i);
    },

    playerQuit:function(chair){
        console.log("playerQuit -------------------" + chair);
        var curIndex = confige.getCurChair(chair);
        this.playerList[curIndex].active = false;

        confige.roomPlayer[chair].isActive = false;
        confige.roomData.player[chair].isActive = false;
        confige.curPlayerData[curIndex] = confige.roomPlayer[chair];
        
        this.newPlayerCount --;
        confige.curPlayerCount --;
        // if(this.newPlayerCount < 6)
            // gameData.gameMainScene.gameInfoNode.btn_inviteFriend.active = true;
        this.playerActiveList[curIndex] = false;
    },

    showNiuType:function(chair, type){
        if(this.niuTypeBoxList[chair].active == true)
            return;
        this.niuTypeBoxList[chair].active = true;
        this.niuTypeBoxList[chair].opacity = 0;
        if(type == 0)//需要根据玩家位置信息特别处理一下手牌位置
        {
            this.niuTypeBoxList[chair].getChildByName("niutypeBg0").active = true;
            this.niuTypeBoxList[chair].getChildByName("niutypeBg1").active = false;
        }else{
            this.niuTypeBoxList[chair].getChildByName("niutypeBg0").active = false;
            this.niuTypeBoxList[chair].getChildByName("niutypeBg1").active = true;
        }

        this.niuTypeBoxList[chair].getChildByName("niutypeFrame").getComponent("cc.Sprite").spriteFrame = confige.niuTypeFrameMap[type];

        this.niuTypeBoxList[chair].runAction(cc.fadeIn(1));
        console.log("male_type_111" + type);
        console.log(confige.roomPlayer[chair]);
        var curSex = 0;
        if(confige.roomPlayer[confige.getOriChair(chair)].playerInfo)
            curSex = parseInt(confige.roomPlayer[confige.getOriChair(chair)].playerInfo.sex);


        if(confige.soundEnable == true)
        {
                if(curSex == 2)
                {
                    confige.playSoundByName("female_type_"+type);
                }else{
                    confige.playSoundByName("male_type_"+type);
                }
        }
    },

    showOneCard:function(chair,callType){
        var curChair = confige.getCurChair(chair);
        // if(curChair == 0)
        // {
        //     gameData.gameMainScene.hideOpenCard(1);
        //     gameData.gameMainScene.hideOpenCard(2);
        // }
        if(gameData.gameMainScene.joinLate == true && curChair == 0)
            return;

        var handCard = this.playerCardList[chair];
        console.log("chair@@@@@"+curChair+"handCard ====");
        console.log(handCard);
        // for(var i=0;i<5;i++)
        var curCardNum = 0;
        for(var i in handCard)
        {
            if(handCard[i])
            {
                curCardNum ++;
                this.playerHandCardList[curChair].setCardWithIndex(i, handCard[i].num, handCard[i].type);
            }
        }

        if(callType == -1)
            return;
        if(curCardNum == 5)
        {
            var curNiuType = 0;
           
             curNiuType = confige.getNiuType(handCard);
            this.showNiuType(curChair, curNiuType.type);
        }
    },

    userDisconne:function(chair){
        this.leaveNodeList[chair].active = true;
    },

    userReconnection:function(chair){
        this.leaveNodeList[chair].active = false;
    },

    showHeadFace:function(chairBegin,chairEnd,index,sex){
        if(confige.loadFaceAni == false) return;
        console.log("showHeadFace  chairBegin=" + chairBegin + "chairEnd=" + chairEnd + "index=" + index);
        var newFaceAni = cc.instantiate(confige.faceAniMap[index]);
        newFaceAni.scale = 0.7;
        newFaceAni.x = this.faceBeginPosList[confige.getCurChair(chairBegin)].x;
        newFaceAni.y = this.faceBeginPosList[confige.getCurChair(chairBegin)].y;
        if(confige.soundEnable == true)
        {
            if(sex == 2)
            {
                confige.playSoundByName("female_face_"+index);
            }else{
                confige.playSoundByName("male_face_"+index);
            }
        }
        console.log("newFaceAni.x===" + newFaceAni.x);
        console.log("newFaceAni.y===" + newFaceAni.y);
        this.userInfoBtnList.addChild(newFaceAni);
        var action1 = cc.moveTo(0.3, cc.p(this.faceBeginPosList[confige.getCurChair(chairEnd)].x, this.faceBeginPosList[confige.getCurChair(chairEnd)].y));
        var action2 = cc.callFunc(function () {
            if(confige.soundEnable == true)
            {
                if(index == 3)
                {
                    if(sex == 2)
                        confige.playSoundByName("face_3");
                    else
                        confige.playSoundByName("face_7");
                }else{
                    confige.playSoundByName("face_"+index);
                }
            }
            newFaceAni.getComponent("cc.Animation").play("faceAni"+index);
        }, this);
        var action3 = cc.delayTime(1);
        var action4 = cc.fadeOut(0.3);
        var action5 = cc.callFunc(function () {
            newFaceAni.destroy();
        }, this);
        var betMoveAction = cc.sequence(action1,action2,action3,action4,action5);

        newFaceAni.runAction(betMoveAction);
    },

    updateScoreByChair:function(chair,score){
        this.playerScoreList[parseInt(chair)] = score;
        this.playerScoreNumList[confige.getCurChair(chair)].string = score;
    },

    btn_showUserInfo:function(event,customEventData){
        var clickIndex = parseInt(customEventData);
        var oriChair = confige.getOriChair(clickIndex);
        if(confige.roomPlayer[oriChair].isActive == true)
        {
            var newCallBack = function(){
                gameData.gameInfoNode.userInfoLayer.userInfoNick.string = confige.roomPlayer[oriChair].playerInfo.nickname;
                gameData.gameInfoNode.userInfoLayer.userInfoID.string = "ID:" + confige.roomPlayer[oriChair].playerInfo.uid;
                var ipString = confige.roomPlayer[oriChair].ip;
                ipString = ipString.substring(7, ipString.length);
                gameData.gameInfoNode.userInfoLayer.userInfoIP.string = "IP:" + ipString;
                gameData.gameInfoNode.userInfoLayer.selectHead = oriChair;
            };
            gameData.gameInfoNode.onBtnShowLayer(-1,2,newCallBack);
        }
    },

    initBankerAni:function(){
        this.bankerAniMask = this.node.getChildByName("bankerAniMask");
        this.bankerBoxList = {};
        for(var i=0;i<this.playerMax;i++)
            this.bankerBoxList[i] = this.lightBgList[i];

        this.resetBankerAni();
        this.bankerEndChair = -1;
    },

    bankerRunListAdd:function(chair){
        this.bankerRunList.push(chair);
    },

    runBankerAni:function(endChair,cb){
        console.log("@@@@@runBankerAni@@@@@");
        this.bankerEndChair = endChair;
        if(this.bankerRunList.length <= 1)
        {
            this.bankerBoxList[endChair].active = true;
            this.bankerBoxList[endChair].opacity = 0;
            this.showBankerAfterAni();
            this.resetBankerAni();
            if(cb)
                cb();
            return;
        }
        for(var i=0;i<this.playerMax;i++){
            this.bankerBoxList[i].active = true;
            this.bankerBoxList[i].opacity = 0;
        }
        this.bankerAniMask.active = true;
        this.bankerRunList.sort();
        this.bankerEndIndex = this.bankerRunList.indexOf(endChair);
        console.log(this.bankerRunList);
        console.log("this.bankerEndChair==="+endChair);
        console.log("this.bankerEndIndex==="+this.bankerEndIndex);
        var moveStep = this.bankerRunList.length+parseInt(Math.random()*5)
        this.bankerBeginIndex = (this.bankerEndIndex + this.bankerRunList.length - (moveStep%this.bankerRunList.length - 1))%this.bankerRunList.length;
        console.log("bankerBeginIndex === ",this.bankerBeginIndex);
        console.log("moveStep===@@@@",moveStep);
        var curStep = 0;
        var self = this;
        this.bankerAniSchedule = function(){
            var curAniChair = self.bankerRunList[(this.bankerBeginIndex+curStep)%this.bankerRunList.length];
            curStep ++;
            if(self.bankerBoxList[curAniChair])
            {
                self.bankerBoxList[curAniChair].stopAllActions();
                self.bankerBoxList[curAniChair].opacity = 0;
                self.bankerBoxList[curAniChair].runAction(cc.sequence(cc.fadeIn(0.15),cc.fadeOut(0.15)));
            }
            if(curStep > moveStep)
            {
                console.log("curStep > moveStep");
                self.unschedule(self.bankerAniSchedule);
                self.showBankerAfterAni();
                self.resetBankerAni();
                if(cb)
                    cb(parseInt(0.2*moveStep));
            }
        };
        this.schedule(this.bankerAniSchedule,0.2);
        this.bankerAniSchedule();
    },

    showBankerAfterAni(){
        for(var i=0;i<this.playerMax;i++){
            if(i == this.bankerEndChair){
                console.log("22222");
                
                var self = this;
                self.bankerBoxList[this.bankerEndChair].stopAllActions();
                this.bankerBoxList[this.bankerEndChair].opacity = 255;
                this.bankerBoxList[this.bankerEndChair].scale = 1.5;
                this.bankerBoxList[this.bankerEndChair].runAction(cc.sequence(cc.scaleTo(0.3,1),cc.callFunc(function(){
                    self.bankerImgList[self.bankerEndChair].active = true;
                    self.bankerImgList[self.bankerEndChair].scale = 2;
                    self.bankerImgList[self.bankerEndChair].runAction(cc.scaleTo(0.3,1));
                })));
            }
            else{
                this.bankerBoxList[i].opacity = 0;
            }
        }
    },

    resetBankerAni:function(){
        // this.bankerEndChair = -1;
        this.bankerBeginChair = -1;
        this.bankerRunList = [];
        this.bankerAniSchedule = -1;
        this.bankerAniMask.active = false;
    },

    initScoreAni:function(){

    },

    resetScoreAni:function(){
        for(var i=0;i<this.playerMax;i++)
        {
            this.scoreAddNodeList[i].y = 0;
            this.scoreSubNodeList[i].y = 0;
            this.scoreAddNodeList[i].stopAllActions();
            this.scoreSubNodeList[i].stopAllActions();
            this.scoreAddNodeList[i].active = false;
            this.scoreSubNodeList[i].active = false;
        }
    },

    showScoreAni:function(curChair,score){
        var moveAction = cc.moveBy(0.5,0,100);
        moveAction.easing(cc.easeOut(3.0));
        if(score >= 0)
        {
            this.scoreAddNodeList[curChair].opacity = 255;
            this.scoreAddNodeList[curChair].active = true;
            this.scoreAddNumList[curChair].string = ":"+score;
            this.scoreAddNodeList[curChair].runAction(cc.sequence(moveAction,cc.delayTime(1.5),cc.fadeOut(0.2)));
        }else{
            this.scoreSubNodeList[curChair].opacity = 255;
            this.scoreSubNodeList[curChair].active = true;
            this.scoreSubNumList[curChair].string = ":"+score;
            this.scoreSubNodeList[curChair].runAction(cc.sequence(moveAction,cc.delayTime(1.5),cc.fadeOut(0.2)));
        }
    },

    initGameCoinAni:function(){
        this.coinAniPos = {};
        for(var i=0;i<this.playerMax;i++)
        {
            var curNode = this.lightBgList[i];
            var newVec1 = this.playerList[i].convertToWorldSpaceAR(cc.v2(curNode.x,curNode.y));
            var newVec2 = this.node.convertToNodeSpaceAR(cc.v2(newVec1.x, newVec1.y));
            this.coinAniPos[i] = {x:newVec2.x,y:newVec2.y};
        }
        this.coinAniBeginPos = {};
        for(var i=0;i<this.playerMax;i++)
        {
            if(i == 0)
                this.coinAniBeginPos[i] = {x:this.coinAniPos[i].x,y:this.coinAniPos[i].y+200};
            if(i >=1 && i<= 3)
                this.coinAniBeginPos[i] = {x:this.coinAniPos[i].x-200,y:this.coinAniPos[i].y};
            if(i >=4 && i<= 5)
                this.coinAniBeginPos[i] = {x:this.coinAniPos[i].x,y:this.coinAniPos[i].y-200};
            if(i >=6 && i<= 8)
                this.coinAniBeginPos[i] = {x:this.coinAniPos[i].x+200,y:this.coinAniPos[i].y};
        }

        this.coinAniNode = this.node.getChildByName("coinAniNode");
        this.coinItemOri = this.coinAniNode.getChildByName("coinItem");
        this.coinList = this.coinAniNode.getChildByName("coinList");

        // this.coinType = 0;  //0:gold;1:diamond;
        // if(this.parent.consumeType == "diamond")
        //     this.coinType = 1;
        // this.winHeadAniList = this.coinAniNode.getChildByName("winHeadAniList"); 
        // this.winHeadAniNodeList = {};
        // this.winHeadAnimationList = {};
        // this.runWinAniList = {};
        // for(var i=0;i<6;i++)
        // {
        //     this.winHeadAniNodeList[i] = this.winHeadAniList.getChildByName("winHeadAni"+i);
        //     this.winHeadAnimationList[i] = this.winHeadAniNodeList[i].getComponent("cc.Animation");
        //     this.runWinAniList[i] = false;
        // }
    },

    createCoinAni:function(fromChair,toChair,oriNum){
        var self = this;
        var num = oriNum;
        if(num < 0)
            num = -num;
        if(num > 10)
            num = 10;
        console.log("cur createCoinAni num ===",num);
        var curTime = 0.6;
        var coinItemList = {};
        for(var i=0;i<num;i++)
        {
            var newCoinItem = cc.instantiate(this.coinItemOri);
            newCoinItem.active = true;
            
            this.coinList.addChild(newCoinItem);
            newCoinItem.x = this.coinAniBeginPos[toChair].x;
            newCoinItem.y = this.coinAniBeginPos[toChair].y;
            newCoinItem.numIndex = i;
            coinItemList[i] = newCoinItem;

            var moveAction = cc.moveTo(curTime,(this.coinAniPos[toChair].x),(this.coinAniPos[toChair].y));
            moveAction.easing(cc.easeOut(1.5));

            newCoinItem.runAction(cc.sequence(cc.delayTime(0.15*i),moveAction));
        }
        this.scheduleOnce(function() {
            for(var i in coinItemList)
                coinItemList[i].removeFromParent(true);
            self.showScoreAni(toChair,oriNum);
        }, 0.15*num+0.7);
    },
});
