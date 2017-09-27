var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad : function () {
        this.cardFrameMap = {};
        this.cardBackFrame = null;
        
        this.cards = new Array(5);
        this.cardsNum = new Array(5);
        this.cards[0] = this.node.getChildByName("Card1")
        this.cards[1] = this.node.getChildByName("Card2")
        this.cards[2] = this.node.getChildByName("Card3")
        this.cards[3] = this.node.getChildByName("Card4")
        this.cards[4] = this.node.getChildByName("Card5")
        this.cardsNum[0] = this.cardsNum[1] = this.cardsNum[2] = this.cardsNum[3] = this.cardsNum[4] = this.cardsNum[5] = 0;
        

        this.cardsBack = new Array(5);
        this.cardBackNode = this.node.getChildByName("CardBack");
        this.cardsBack[0] = this.cardBackNode.getChildByName("Card1")
        this.cardsBack[1] = this.cardBackNode.getChildByName("Card2")
        this.cardsBack[2] = this.cardBackNode.getChildByName("Card3")
        this.cardsBack[3] = this.cardBackNode.getChildByName("Card4")
        this.cardsBack[4] = this.cardBackNode.getChildByName("Card5")
        
        this.resetCard();
        // this.initCardWithBack();
    },

    initCardWithBack : function(){
        for(var i=0;i<5;i++)
        {
            this.cardsBack[i].opacity = 255;
        }
    },
    
    setCardWithIndex : function(index, num, type){
        this.cards[index].opacity = 255;
        var curCardIndex = num + type*13;
        this.cards[index].getComponent("cc.Sprite").spriteFrame = confige.cardFrameMap[curCardIndex];
        var action2 = cc.callFunc(function() {
            var action3 = cc.scaleTo(0.2,1,1);
            this.cards[index].runAction(action3);
        }, this, 100);
        var action1 = cc.scaleTo(0.2,0,1);
        this.cardsBack[index].runAction(cc.sequence(action1,action2));
    },
    
    resetCard:function(){
        for(var i=0;i<5;i++)
        {
            this.cards[i].opacity = 0;
            this.cardsBack[i].opacity = 0;
            this.cards[i].scaleX = 0;
            this.cardsBack[i].scaleX = 1;
        }
    },

    showCardBackWithIndex:function(index){
        this.cardsBack[index].opacity = 255;
    },

    showCardBackWithCount:function(count){
        for(var i=0;i<count;i++)
            this.cardsBack[i].opacity = 255;
    },
});
