var gameData = require("gameData");
var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        cardItem:{
            default:null,
            type:cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    onInit:function(){
        this.cardItemList = {};
        this.cardItemCount = 0;
        this.mainPlayerScale = 1.42;
        this.otherPlayerScale = 1;
        
        this.playerActiveList = {};
        this.handCardPosList =  {};
        this.handCardList = {};
        
        this.playerMax = confige.playerMax;
        for(var i=0;i<this.playerMax;i++)
        {
            this.handCardList[i] = gameData.gamePlayerNode.playerHandCardList[i];
        }

        for(var i=0;i<this.playerMax;i++){
            this.handCardPosList[i] = {};
            this.playerActiveList[i] = false;
            for(var j=0;j<5;j++){
                var curCardBackNode = this.handCardList[i].cardsBack[j];
                var newVec1 = this.handCardList[i].node.convertToWorldSpaceAR(cc.v2(curCardBackNode.x,curCardBackNode.y));
                var newVec2 = this.node.convertToNodeSpaceAR(cc.v2(newVec1.x, newVec1.y));
                this.handCardPosList[i][j] = {x:newVec2.x,y:newVec2.y};
            }
        }
        
        // var self = this;
        // this.scheduleOnce(function(){
        //     self.testDisCard2();
        // },2);
        // this.scheduleOnce(function(){
        //     self.testDisCard();
        // },4);
        this.disRoundCount = 0;
    },

    resetCardList:function(){
        for(var i=0;i<this.playerMax;i++){
            this.playerActiveList[i] = false;
        }
        for(var i=0;i<this.cardItemCount;i++)
            this.cardItemList[i].destroy();
        this.cardItemCount = 0;
        this.disRoundCount = 0;
    },

    activePlayer:function(index){
        this.playerActiveList[index] = true;
    },

    deActivePlayer:function(index){
        console.log("deActivePlayer"+index);
        this.playerActiveList[index] = false;
    },

    disCardOneRound:function(){
        console.log("disCardOneRound@@@@@@@@@@@@@");
        var disCount = 0;
        var disMax = this.playerMax;
        this.disRoundCount ++;
        var curRoundCount = this.disRoundCount - 1;
        if(curRoundCount >= 5)
            return;
        var callBack = function(){
            if(this.playerActiveList[disCount] == true)
            {
                var newCardItem = cc.instantiate(this.cardItem);
                this.node.addChild(newCardItem);
                newCardItem.active = true;
                newCardItem.x = 0;
                newCardItem.y = 0;
                this.cardItemList[this.cardItemCount] = newCardItem;
                this.cardItemCount ++;

                var action1 = cc.moveTo(0.2, cc.p(this.handCardPosList[disCount][curRoundCount].x, this.handCardPosList[disCount][curRoundCount].y));
                var scaleNum = 1;
                if(disCount == 0 && this.playerMax == 9)
                    scaleNum = this.mainPlayerScale;
                else
                    scaleNum = this.otherPlayerScale;
                var action2 = cc.scaleTo(0.2,scaleNum);
                var self = this
                var action3 = (function(disCount,curRoundCount,self) {
                   return cc.callFunc(function () {
                    newCardItem.active = false;
                    self.handCardList[disCount].showCardBackWithIndex(curRoundCount);
                }, self)
                })(disCount,curRoundCount,self)

                newCardItem.runAction(cc.sequence(cc.spawn(action1,action2), cc.delayTime(0.1),action3));
            }            
            disCount ++;
            if(disCount == this.playerMax)
            {
                this.unschedule(callBack);
            }
        };

        this.schedule(callBack,0.05);
    },

    disCardWithRoundTime:function(rountTime){
        var callTime = 0;
        var callMax = rountTime;
        var callBack2 = function(){
            this.disCardOneRound();
            callTime ++;
            if(callTime == callMax)
                this.unschedule(callBack2);
        };
        this.schedule(callBack2,0.07);
    },


    testDisCard:function(){
        this.disCardWithRoundTime(5);
    },

    testDisCard2:function(){
        for(var i=0;i<this.playerMax;i++){
            for(var j=0;j<5;j++){
                var newCardItem = cc.instantiate(this.cardItem);
                this.node.addChild(newCardItem);
                newCardItem.active = true;
                newCardItem.x = 0;
                newCardItem.y = 0;
                newCardItem.runAction(cc.moveTo(0.5,this.handCardPosList[i][j].x,this.handCardPosList[i][j].y));
            }
        }
    },
});
