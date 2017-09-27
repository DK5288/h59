var gameData = require("gameData");
var confige = require("confige");
cc.Class({
    extends: cc.Component,

    properties: {
        betItemPrefab:{
            default:null,
            type:cc.Prefab
        },

        betItemFrame0:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame1:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame2:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame3:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame4:{
            default:null,
            type:cc.SpriteFrame
        },
        betItemFrame5:{
            default:null,
            type:cc.SpriteFrame
        },
    },

    onLoad: function () {
    },

    onInit:function(){
        gameData.gameBGNode = this;
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER){
            this.bgNode = this.node.getChildByName("mainBg");
            this.bgNode.height = 790;
        }
        this.mainBg = this.node.getChildByName("mainNode");
        this.scorePool = this.mainBg.getChildByName("scorePool");
        this.scorePoolLabel = this.scorePool.getChildByName("score").getComponent("cc.Label");
        this.scorePoolNum = 0;

        this.betItemListAll = {};
        this.betItemCount = 0;
        this.betBeginPosList = {};
        this.betBeginPosList[0] = cc.v2(116,83);
        this.betBeginPosList[1] = cc.v2(1226,362);
        this.betBeginPosList[2] = cc.v2(970,650);
        this.betBeginPosList[3] = cc.v2(640,650);
        this.betBeginPosList[4] = cc.v2(305,650);
        this.betBeginPosList[5] = cc.v2(58,360);
        this.betFrameList = {};
        this.betFrameList[0] = this.betItemFrame0;
        this.betFrameList[1] = this.betItemFrame1;
        this.betFrameList[2] = this.betItemFrame2;
        this.betFrameList[3] = this.betItemFrame3;
        this.betFrameList[4] = this.betItemFrame4;
        this.betFrameList[5] = this.betItemFrame5;
    },

    betItemListAddBet:function(chair,betNum){
        console.log("betItemListAddBet" + chair);
        if(this.betItemCount < 200)
        {
            for(var i=0;i<betNum;i++)
            {
                var newBetItem = cc.instantiate(this.betItemPrefab);
                newBetItem.getComponent("cc.Sprite").spriteFrame = this.betFrameList[3];
                this.mainBg.addChild(newBetItem);
                newBetItem.x = this.betBeginPosList[chair].x;
                newBetItem.y = this.betBeginPosList[chair].y;

                this.betItemListAll[this.betItemCount] = newBetItem;
                this.betItemCount ++;
                var betMoveAction = cc.spawn(cc.moveTo(0.3, cc.p(630 - 100 + Math.random()*220, 360 - 50 + Math.random()*100)),
                                             cc.rotateBy(0.3, 1080 + Math.random()*200));
                betMoveAction.easing(cc.easeOut(2.0 + Math.random()*0.5));
                newBetItem.runAction(betMoveAction);
            }
        }
    },

    betItemListClean:function(){
        for(var i in this.betItemListAll)
        {
            this.betItemListAll[i].destroy();
        }
        this.betItemCount = 0;
        this.betItemListAll = {};
    },

    betItemRemove:function(chair,num){
        console.log("当前还剩下"+this.betItemCount+"个筹码！！!!!!");
        console.log("betItemRemove" + chair + "num===" + num);
        for(var i=0;i<num;i++)
        {
            this.betItemCount --;
            if(this.betItemCount < 0)
                continue;
            var curBetItem = this.betItemListAll[this.betItemCount];
            curBetItem.stopAllActions();

            var betMoveAction = cc.spawn(cc.moveTo(0.3, cc.p(this.betBeginPosList[chair].x, this.betBeginPosList[chair].y)),
                                         cc.rotateBy(0.3, 1080 + Math.random()*200));
            var betDestory = cc.callFunc(function () {
                // curBetItem.opacity = 0;
                curBetItem.destroy();
            }, this);
            curBetItem.runAction(cc.sequence(betMoveAction,cc.delayTime(0.1),betDestory));
        }
    },

    betItemRemove2:function(chair,num){
        console.log("当前还剩下"+this.betItemCount+"个筹码22222！！!!!!");
        console.log("22222betItemRemove" + chair + "num2222===" + num);
        for(var i=0;i<num;i++)
        {
            this.betItemCount --;
            if(this.betItemCount < 0)
                continue;
            var curBetItem = this.betItemListAll[this.betItemCount];
            curBetItem.stopAllActions();
            curBetItem.destroy();
        }
    },

    betItemCreate:function(betNum){
        console.log("betItemListAddBet" + betNum);
            for(var i=0;i<betNum;i++)
            {
                if(this.betItemCount < 200)
                {
                    var newBetItem = cc.instantiate(this.betItemPrefab);
                    newBetItem.getComponent("cc.Sprite").spriteFrame = this.betFrameList[3];
                    this.mainBg.addChild(newBetItem);
                    newBetItem.x = 630 - 100 + Math.random()*220;
                    newBetItem.y = 360 - 50 + Math.random()*100;

                    this.betItemListAll[this.betItemCount] = newBetItem;
                    this.betItemCount ++;
                }
            }
    },

    betItemCreate2:function(allNum){
        console.log("allNum ===== " + allNum);
        console.log("this.betItemCount ===== " + this.betItemCount);
        if(allNum > this.betItemCount)
        {
            var allCount = allNum - this.betItemCount;
            for(var i=0;i<allCount;i++)
            {
                if(this.betItemCount < 200)
                {
                    var newBetItem = cc.instantiate(this.betItemPrefab);
                    newBetItem.getComponent("cc.Sprite").spriteFrame = this.betFrameList[3];
                    this.mainBg.addChild(newBetItem);
                    newBetItem.x = 630 - 100 + Math.random()*220;
                    newBetItem.y = 360 - 50 + Math.random()*100;

                    this.betItemListAll[this.betItemCount] = newBetItem;
                    this.betItemCount ++;
                }
            }
        }else{
            var removeCount = this.betItemCount - allNum;
            for(var i=0;i<removeCount;i++)
            {
                this.betItemCount --;
                if(this.betItemCount < 0)
                    continue;
                var curBetItem = this.betItemListAll[this.betItemCount];
                curBetItem.stopAllActions();
                curBetItem.destroy();
                console.log("destroy11111");
            }
        }
        console.log("this.betItemCount2222222 ===== " + this.betItemCount);
    },

    betItemRemoveToBanker:function(bankerChair){
        console.log("betItemRemoveToBanker" + bankerChair);
        if(bankerChair == -1)
            bankerChair = 0;
        console.log(this.betItemListAll);
        console.log("this.betItemCount==="+this.betItemCount);
        for(var i=0;i<this.betItemCount;i++)
        {
            var curBetItem = this.betItemListAll[i];
            var betMoveAction = cc.spawn(cc.moveTo(0.2, cc.p(this.betBeginPosList[bankerChair].x, this.betBeginPosList[bankerChair].y)),
                                         cc.rotateBy(0.2, 1080 + Math.random()*200));
            var betDestory = cc.callFunc(function () {
                // curBetItem.opacity = 0;
                curBetItem.destroy();
            }, this);
            curBetItem.runAction(cc.sequence(betMoveAction, cc.delayTime(0.1),betDestory));
        }
    },

    betItemSendFromBanker:function(scoreList,bankerChair){
        console.log("betItemSendFromBanker");
        var curBetCount = 0;
        for(var i in scoreList)
            if(scoreList[i] > 0)
                curBetCount += scoreList[i];
        for(var i=0;i<curBetCount;i++)
        {
            var newBetItem = cc.instantiate(this.betItemPrefab);
            newBetItem.getComponent("cc.Sprite").spriteFrame = this.betFrameList[3];//[Math.floor(Math.random()*100)%6];
            this.mainBg.addChild(newBetItem);
            newBetItem.x = this.betBeginPosList[bankerChair].x;
            newBetItem.y = this.betBeginPosList[bankerChair].y;
            this.betItemListAll[this.betItemCount] = newBetItem;
            this.betItemCount ++;
        }
        var self = this;
        for(var i in scoreList)
            if(scoreList[i] > 0)
            {
                for(var j=0;j<scoreList[i];j++)
                {   
                    self.betItemCount --;
                    if(self.betItemCount < 0)
                        continue;
                    var sendBetOnceFunc = function(){
                        var betMoveAction = cc.spawn(cc.moveTo(0.2, cc.p(self.betBeginPosList[confige.getCurChair(sendBetOnceFunc.i)].x, self.betBeginPosList[confige.getCurChair(sendBetOnceFunc.i)].y)),
                                                     cc.rotateBy(0.2, 1080 + Math.random()*200));
                        var betDestory = cc.callFunc(function () {
                            // sendBetOnceFunc.curBetItem.opacity = 0;
                            sendBetOnceFunc.curBetItem.destroy();
                        }, this);

                        var moveActionPlus = cc.sequence(betMoveAction, cc.delayTime(0.1),betDestory);
                        moveActionPlus.easing(cc.easeOut(1.0));

                        sendBetOnceFunc.curBetItem.runAction(moveActionPlus);
                    };
                    sendBetOnceFunc.curBetItem = self.betItemListAll[self.betItemCount];
                    sendBetOnceFunc.i = i;
                    this.scheduleOnce(sendBetOnceFunc, Math.random() * 0.5);//Math.floor(Math.random()*100));
                }
            }
    },
});
