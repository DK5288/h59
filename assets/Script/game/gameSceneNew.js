var gameData = require("gameData");
var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onDestory:function(){
        console.log("gameScene onDestory!!!!!!")
        if(confige.curUsePlatform == 1)
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "JAVALog", "(Ljava/lang/String;)V", "gameScene onDestory!!!!!!");
    },

    onLoad: function () {
        this.resNode = this.node.getChildByName("resNode");
        if(confige.joinState == true)
            this.newJoinRoom();
        else
            this.initRoomInfo();

        pomelo.clientScene = this;
        confige.curGameScene = this;
        gameData.gameMainScene = this;

        console.log(cc.director.getVisibleSize());
        cc.view.setDesignResolutionSize(cc.director.getVisibleSize().width,cc.director.getVisibleSize().height,cc.ResolutionPolicy.EXACT_FIT);
    },

    newJoinRoom:function(){
        if(confige.joinState == false)
            this.roomInfoLayer.active = false;
        var loadResType = 1;
        var roomIdStr = confige.roomData.roomId.toString();
        roomIdStr = roomIdStr.substring(roomIdStr.length-6,roomIdStr.length);
        if(confige.roomData.GAME_PLAYER == 6)
        {
            confige.playerMax = 6;
            loadResType = 1;
            this.node.getChildByName("gameBg1").active = true;
            document.title = "熟人六人牛牛(房间号:" + roomIdStr + ")";
            // this.node.getChildByName("gameBg2").active = false;
        }else if(confige.roomData.GAME_PLAYER == 9){
            confige.playerMax = 9;
            loadResType = 2;
            // this.node.getChildByName("gameBg1").active = false;
            this.node.getChildByName("gameBg2").active = true;
            document.title = "熟人九人牛牛(房间号:" + roomIdStr + ")";
        }

        this.playerNode = this.node.getChildByName("playerNode");
        this.infoNode = this.node.getChildByName("infoNode");
        this.playerLoadOK = false;
        this.infoLoadOK = false;
        this.doLaterLoad = false;
        var self = this;
        cc.loader.loadRes("prefabs/roomInfoNode"+loadResType, cc.Prefab, function (err, prefabs) {
            console.log("gameInfoNode load!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            var newLayer = cc.instantiate(prefabs);
            self.infoNode.addChild(newLayer);
            self.gameInfoNode = newLayer.getComponent("gameInfoNode");
            self.gameInfoNode.onInit();
            self.infoLoadOK = true;
            if(self.playerLoadOK == true && self.infoLoadOK == true)
            {
                if(self.doLaterLoad == false)
                {
                    self.doLaterLoad = true;
                    self.loadRes1();
                    // self.loadLater();
                    // self.startLater();
                    // self.loadRes2();
                }
            }
        });
        cc.loader.loadRes("prefabs/playerNode"+loadResType, cc.Prefab, function (err, prefabs) {
            console.log("gamePlayerNode load!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            var newLayer = cc.instantiate(prefabs);
            self.playerNode.addChild(newLayer);
            self.gamePlayerNode = newLayer.getComponent("gamePlayerNode");
            self.gamePlayerNode.onInit();
            self.playerLoadOK = true;
            if(self.playerLoadOK == true && self.infoLoadOK == true)
            {
                if(self.doLaterLoad == false)
                {
                    self.doLaterLoad = true;
                    self.loadRes1();
                    // self.loadLater();
                    // self.startLater();
                    // self.loadRes2();
                }
            }
        });

        console.log("gameScene Load!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    },

    start: function () {

    },
    
    loadLater:function(){
        console.log("loadLater!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        pomelo.clientScene = this;
        confige.curGameScene = this;
        gameData.gameMainScene = this;
        this.sceneLoadOver = false;
        this.timeCallFunc = -1;
        this.waitForSettle = false;

        this.cardMode = confige.roomData.cardMode;
        this.gameMode = confige.roomData.gameMode;
        this.bankerMode = confige.roomData.bankerMode;
        this.time_rob = Math.ceil(confige.roomData.TID_ROB_TIME/1000);
        this.time_betting = Math.ceil(confige.roomData.TID_BETTING/1000);
        this.time_settlement = Math.ceil(confige.roomData.TID_SETTLEMENT/1000);
        
        this.meChair = 0;
        this.curBankerChair = -1;

        this.isMingCardQZ = false;
        
        if(confige.roomData.roomType == "mingpaiqz")
        {
            this.isMingCardQZ = true;
            this.mingcardqzBasicType = confige.roomData.basicType;
            this.initMingCardQZ();
        }

        this.joinState = confige.roomData.state;
        this.gameBegin = false;     //本房间游戏开始
        this.gameStart = false;     //当前局游戏开始
        this.joinLate = false;
        

        this.timerItem = this.node.getChildByName("btnNode").getChildByName("clockItem").getComponent("timerItem");
        this.timerItem.onInit();

        this.statusNode = this.node.getChildByName("btnNode").getChildByName("statusLabel");
        this.statusLabel = this.node.getChildByName("btnNode").getChildByName("statusLabel").getComponent("cc.Label");

        this.allBetNum = 0;
        this.myBetNum = 0;

        this.readyBtn = this.node.getChildByName("btnNode").getChildByName("btnReady");
        this.readyBtn.active = true;
        this.showCardBtn = this.node.getChildByName("btnNode").getChildByName("btnShowCard");
        this.showCardBtn2 = this.gamePlayerNode.node.getChildByName("btnShowCard");
        this.betNumMax = 20;
        this.niuniuBetType = 1;

        // this.gameStatus = this.node.getChildByName("gameStatus");
        // this.gameStatusList = {};
        // for(var i=1;i<=5;i++)
        // {
        //     this.gameStatusList[i] = this.gameStatus.getChildByName("tips" + i);
        // }

        this.btnCanSend = true;
    },

    startLater: function () {
        this.gamePlayerNode.onStart();

        if(confige.curReconnectData == -1)  //是否属于重连状态
        {
            if(this.joinState == 1005)
            {
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {
                        this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
                    }
                }
            }
            if(this.joinState != 1001)   //本局游戏已经开始才加入
            {
                this.gameBegin = true;
                this.gameInfoNode.btn_inviteFriend.active = false;
                // this.gameInfoNode.btn_close.interactable = false;
                console.log("本局游戏已经开始才加入,进入观战模式");
                console.log("当前参与游戏的人数===" + this.gamePlayerNode.playerCount);
                var watchPlayer = 0;
                // for(var i=0;i<this.playerCount;i++)
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == false)
                    {
                        watchPlayer ++;
                        console.log("有一个观战的玩家");
                    }
                    if(confige.roomPlayer[i].isBanker == true)
                    {
                        this.curBankerChair = i;
                        this.gamePlayerNode.playerList[confige.getCurChair(this.curBankerChair)].getChildByName("banker").active = true;
                        this.gamePlayerNode.lightBgList[confige.getCurChair(this.curBankerChair)].active = true;
                    }
                }
                this.gamePlayerNode.playerCount -= watchPlayer;
                this.readyBtn.active = false;
                this.gameStart = true;
                this.joinLate = true;
                if(this.cardMode == 2)
                {   
                    if(this.joinState == 1002)
                    {
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {   
                                var curChair = confige.getCurChair(i);
                                if(curChair != 0)
                                    this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithCount(3);

                                if(confige.roomPlayer[i].isBanker == true)
                                {
                                    this.curBankerChair = i;
                                }
                            }
                        }
                    }
                }

                if(this.joinState == 1003)
                {
                    for(var i in confige.roomPlayer)
                    {
                        if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                        {   
                            this.gamePlayerNode.playerCardList[i] = confige.roomData.player[i].handCard;
                            this.gamePlayerNode.playerHandCardList[confige.getCurChair(i)].initCardWithBack();
                            var curChair = confige.getCurChair(i);
                            if(curChair != 0 && confige.roomPlayer[i].isShowCard == true)
                                this.gamePlayerNode.showOneCard(i);
                            this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithCount(5);
                        }
                    }
                }

                if(this.isMingCardQZ)
                {
                    if(this.joinState == 1005 || this.joinState == 1002)
                    {
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {
                                this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
                            }
                        }
                        this.onReConnect = true;
                        // this.newDisCard(4);
                        var cardsCount = 0;
                        for(var i in confige.roomPlayer)
                        {
                            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                            {
                                var curChair = confige.getCurChair(i);
                                this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithCount(4);
                                console.log("重连直接显示玩家盖着的牌" + i);
                                if(confige.roomPlayer[i].handCard)
                                {
                                    var callFunc = function(){
                                        for(var i in callFunc.cards)
                                        {
                                            this.gamePlayerNode.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
                                        }
                                    };
                                    callFunc.cards = confige.roomPlayer[i].handCard;
                                    callFunc.curChair = curChair;
                                    this.scheduleOnce(callFunc,0.2);
                                }
                            }
                        }
                    }   
                    if(this.joinState != 1005 && this.joinState != 1001)
                    {
                        var robStateList = confige.roomData.robState;
                        for(var i in robStateList)
                        {
                            if(robStateList[i] != -1)
                            {
                                if(robStateList[i] > this.curRobMaxNum)
                                    this.curRobMaxNum = robStateList[i];
                            }
                        }
                        if(this.curRobMaxNum == 0)
                            this.curRobMaxNum = 1;
                        this.robMaxNumNode.active = true;
                        this.robMaxNumLabel.string = this.curRobMaxNum + ";<";
                    }
                    if(this.joinState == 1002)
                    {
                        var betList = confige.roomData.betList;
                    }else{
                        var robStateList = confige.roomData.robState;
                        for(var i in robStateList)
                        {
                            this.gamePlayerNode.playerList[i].getChildByName("banker").active = false;
                            if(robStateList[i] != -1)
                            {
                                var curChair = confige.getCurChair(i);
                                if(robStateList[i] > this.curRobMaxNum)
                                    this.curRobMaxNum = robStateList[i];
                                if(robStateList[i] == 0)
                                    this.gamePlayerNode.noRobImgList[curChair].active = true;
                                else{
                                    this.gamePlayerNode.robNumLabelList[curChair].string = ">?;"+robStateList[i];
                                    this.gamePlayerNode.robNumNodeList[curChair].active = true;
                                }
                            }
                        }
                        this.statusChange(2);
                    }
                }                      
            }
        }else{
            this.recoverGame();
            confige.curReconnectData = -1;
        }
        console.log("roomId + meChair === " + (confige.roomData.roomId*10 + this.meChair));
        

        this.sceneLoadOver = true;
        
        //处理缓存的服务器消息
        confige.gameSceneLoadOver = true;
        confige.curSceneIndex = 2;
        var infoCount = confige.gameSceneLoadData.length;
        console.log(confige.gameSceneLoadData);
        for(var i=0;i<infoCount;i++)
        {
            console.log("deal once!!!!!!!!");
            var curInfo = confige.gameSceneLoadData.shift();
            pomelo.dealWithOnMessage(curInfo);
            console.log(curInfo);
        }
        confige.gameSceneLoadData = [];
        console.log(confige.gameSceneLoadData);
    },

    setBanker:function(chair){
        this.curBankerChair = chair;
    },

    showScorePool:function(score,type,bankerScore,change){
        console.log("show fuck score pool!!!!!!");
        if(this.isMingCardQZ)
        {
            // this.robBetNumLabel.string = score;
            return;
        }
    },

    showGameStatus:function(index){
        this.statusNode.active = false;
        if(index == 1)
            this.statusLabel.string = "抢庄";
        if(index == 2)
            this.statusLabel.string = "请下注";
        if(index == 3)
            this.statusLabel.string = "闲家下注";
        if(index == 4)
            this.statusLabel.string = "等待摊牌";
    },

    hideGameStatus:function(){
        this.statusNode.active = false;
    },

    addBet:function(betNum, chair){
        if(chair == 0){
            this.betBtnBox.active = false;
            this.myBetNum = this.myBetNum + betNum;
        }

        this.gamePlayerNode.robNumLabelList[chair].string = betNum;
        this.gamePlayerNode.robNumNodeList[chair].active = true;
    },

    onBtnReadyClicked:function(){
        if(this.btnCanSend)
        {
            this.btnCanSend = false;
            pomelo.request("connector.entryHandler.sendData", {"code" : "ready"}, function(data) {
                console.log("flag is : "+ data.flag);
                if(data.flag == true)
                {
                        console.log("fuck onBtnReadyClicked !!!!!!!!!");
                        this.readyBtn.active = false;
                }
                this.btnCanSend = true;
            }.bind(this));
            
        }
    },
    
    onBtnBetClicked:function(event, customEventData){
    },
    
    onServerRobBanker:function(){
        this.timerItem.setTime(this.time_rob);
        if(this.isMingCardQZ)
            this.showGameStatus(1);

        if(this.joinLate == false)
        {
            if(this.isMingCardQZ)
            {
                this.robBtnBox.active = true;
            }
        }
        console.log("fuck rob banker");
    },
    
    onServerRobBankerReturn:function(data){
        var curChair = confige.getCurChair(data.chair);
        if(curChair == 0)
            this.robBtnBox.active = false;

        if(this.isMingCardQZ)
        {
            if(data.num > this.curRobMaxNum)
                this.curRobMaxNum = data.num;
            if(data.num == 0)
                this.gamePlayerNode.noRobImgList[curChair].active = true;
            else{
                this.gamePlayerNode.robNumLabelList[curChair].string = data.num;
                this.gamePlayerNode.robNumNodeList[curChair].active = true;
                this.gamePlayerNode.bankerRunListAdd(curChair);
            }
        }else{
            if(data.flag == 1)
            {
                this.gamePlayerNode.isRobImgList[curChair].active = true;
                this.gamePlayerNode.bankerRunListAdd(curChair);
            }else if(data.flag == 2){
                this.gamePlayerNode.noRobImgList[curChair].active = true;
            } 
        }
    },

    statusChange:function(index){
        if(index === 1)
        {
            this.timerItem.setTime(this.time_betting);
        }
        else if(index === 2)
        {
            this.timerItem.setTime(this.time_settlement);
        }
    },
    
    onServerReady:function(chair){
        confige.roomPlayer[confige.getOriChair(chair)].isReady = true;
        console.log(confige.getOriChair(chair) + "号玩家准备");
        this.onReConnect = false;
        this.gamePlayerNode.readyImgList[chair].active = true;

        if(this.isMingCardQZ)
        {
            this.curRobMaxNum = 0;
        }
        if(chair == 0)      //当前玩家自己
        {
            this.showCardBtn.active = false;
            this.showCardBtn2.active = false;
            this.joinLate = false;

            // this.showGameStatus(5);
            // if(confige.roomData.gameMode != 3)
            //     this.gameBGNode.scorePool.active = false;
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true)
                {   
                    var curChair = confige.getCurChair(i);
                    this.gamePlayerNode.playerHandCardList[curChair].resetCard();
                    this.gamePlayerNode.niuTypeBoxList[curChair].active = false;
                    this.gamePlayerNode.bankerImgList[curChair].active = false;
                    this.gamePlayerNode.lightBgList[curChair].active = false;
                    this.gamePlayerNode.noRobImgList[curChair].active = false;
                    this.gamePlayerNode.robNumNodeList[curChair].active = false;
                }
            }
        }
    },
    
    onServerBeginBetting:function(data){
        var bankerChair = data.banker;
        this.curBankerChair = bankerChair;
        var self = this;
        var callFunc = function(bankerAniTime){
            self.allBetNum = 0;
            self.myBetNum = 0;

            console.log("fuck joinLate =====!!!!!!!!!" + self.joinLate);
            self.statusChange(1);
            console.log("onServerBeginBetting111111");
            if(bankerChair == self.meChair)
                self.showGameStatus(3);
            else
                self.showGameStatus(2);
          
            console.log("onServerBeginBetting222222");
            // if(bankerChair != -1)
            // {
            //     self.gamePlayerNode.bankerImgList[confige.getCurChair(bankerChair)].active = true;
            //     self.gamePlayerNode.lightBgList[confige.getCurChair(bankerChair)].active = true;
            // }
            
            console.log("onServerBeginBetting333333");
            if(self.joinLate == false)
            {
                console.log("onServerBeginBetting311");
            }else{
                if(self.joinState == 1005 &&  self.cardMode == 2)
                {
                    for(var i in confige.roomPlayer)
                    {
                        if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                        {
                            var curChair = confige.getCurChair(i);
                            if(curChair != 0)
                                self.playerHandCardList[curChair].showCardBackWithCount(3);
                        }
                    }
                }
            }
            console.log("onServerBeginBetting444444");
        };
        
        if(this.isMingCardQZ)
        {
            this.robBtnBox.active = false;
            if(this.joinLate == false && bankerChair != this.meChair)
                this.betBtnBox.active = true;
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    var curIndex = confige.getCurChair(i);
                    if(i != bankerChair){
                        this.gamePlayerNode.robNumNodeList[curIndex].active = false;
                        this.gamePlayerNode.noRobImgList[curIndex].active = false;
                    }
                }
            }
        }
        this.gamePlayerNode.runBankerAni(confige.getCurChair(data.banker),callFunc);
    },

    onServerDealCard:function(handCards){
        this.showGameStatus(4);
        this.betBtnBox.active = false;
        
        for(var i in handCards)
        {
            if(handCards.hasOwnProperty(i))
            {
                this.gamePlayerNode.playerCardList[i] = handCards[i];
            }
        }
        this.statusChange(2);
        if(this.cardMode == 2 && this.joinLate == false)
        {
            console.log("onServerDealCard11111222");
                this.newDisCard(1);
                // var callFunc = function(){
                //     if(this.gameStart == true)
                //         this.showOpenCard(2);
                // };
                // this.scheduleOnce(callFunc,0.3);
        }else if(this.isMingCardQZ){
            console.log("onServerDealCard22222");
            if(this.onReConnect == false)
            {
                if(this.joinLate == false)
                {
                    var callFunc = function(){
                        if(this.gameStart == true)
                        {
                            if(this.joinLate == false)
                                this.showOpenCard(2);
                        }
                    };
                    this.scheduleOnce(callFunc,0.5);
                }
            }
        }else{
            console.log("onServerDealCard333333");
            this.newDisCard(5);
             if(this.joinLate == false)
            {
                var curChair = confige.getCurChair(this.meChair);
                var curCardData = this.gamePlayerNode.playerCardList[this.meChair];
                var callFunc = function(){
                    console.log("显示玩家明牌");
                    for(var j=0;j<3;j++)
                    {
                        var index = parseInt(j);
                        this.gamePlayerNode.playerHandCardList[callFunc.curChair].setCardWithIndex(index, callFunc.curCardData[index].num, callFunc.curCardData[index].type);
                    }
                    if(this.gameStart == true)
                    {
                        this.showOpenCard(1);
                        this.showOpenCard(2);
                    }
                };
                callFunc.curCardData = curCardData;
                callFunc.curChair = curChair;
                this.scheduleOnce(callFunc,0.5);
            }
        }
        if(this.onReConnect)
        {
            if(this.isMingCardQZ)
            {
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {  
                        var curChair = confige.getCurChair(i);
                        this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithIndex(4);
                        if(this.joinLate == false)
                            this.showOpenCard(2);
                        console.log("onServerDealCard5555555555");
                    }
                }
            }
        }
        console.log("onServerDealCard44444");
        
        if(this.joinLate == false)
        {
            var callFunc2 = function(){
                this.showCardBtn.active = true;
                this.showCardBtn2.active = true;
            };
            this.scheduleOnce(callFunc2,0.5);

            if(this.isMingCardQZ)
            {
                this.robBtnBox.active = false;
            }
        }
    },

    btn_showMyCard:function(){
        pomelo.clientSend("showCard");
        this.showCardBtn.active = false;
        this.showCardBtn2.active = false;

        var handCard = this.gamePlayerNode.playerCardList[this.meChair];
        var curNiuType = 0;
        
            curNiuType = confige.getNiuType(handCard);
        this.gamePlayerNode.showNiuType(0, curNiuType.type);
    },
    
    showMingCard:function(cards){
        var cardsCount = 0;
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
            {
                var curChair = confige.getCurChair(i);
            }
        }
        for(var i in cards)
        {
            cardsCount ++;
        }
        
        this.newDisCard(cardsCount);

        var callFunc = function(){
            for(var i in callFunc.cards)
            {
                this.gamePlayerNode.playerHandCardList[0].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
            }
        };
        callFunc.cards = cards;
        this.scheduleOnce(callFunc,0.5);
    },

    onServerSettlement:function(data){
        this.hideGameStatus();
        console.log("onServerSettlement 1111111");
        
        this.statusChange(0);

        console.log("onServerSettlement 222222222");
        //第一步显示玩家手牌
        for(var i in data.result)
        {
            if(data.result.hasOwnProperty(i))
            {
                this.gamePlayerNode.showOneCard(i);
            }
        }
        console.log("onServerSettlement 33333333");
        this.waitForSettle = true;
        this.showCardBtn.active = false;
        this.showCardBtn2.active = false;
        this.timerItem.hideTimer();
        
        var self = this;

        var showSettleFunc1 = function(){
            for(var i in data.result)
            {
                if(data.curScores.hasOwnProperty(i))
                {
                    if(data.curScores[i] < 0){
                        console.log("?????!!!!!!",data.curScores[i]);
                        if(i != this.curBankerChair)
                            this.gamePlayerNode.createCoinAni(confige.getCurChair(i),confige.getCurChair(this.curBankerChair),data.curScores[i]);
                    }
                }
            }
        };
        this.scheduleOnce(showSettleFunc1,1);

        var showSettleFunc2 = function(){
            for(var i in data.result)
            {
                if(data.curScores.hasOwnProperty(i))
                {
                    if(data.curScores[i] >= 0)
                        this.gamePlayerNode.createCoinAni(confige.getCurChair(this.curBankerChair),confige.getCurChair(i),data.curScores[i]);
                }
            }
        };
        this.scheduleOnce(showSettleFunc2,2);
        
        var showSettleFunc3 = function(){
            for(var i in data.result)
            {
                if(data.result.hasOwnProperty(i))
                {
                    this.gamePlayerNode.playerScoreList[i] = data.realScores[i];
                    this.gamePlayerNode.playerScoreNumList[i].string = this.gamePlayerNode.playerScoreList[i];
                }
            }
        };
        this.scheduleOnce(showSettleFunc3,3);

        var showSettleFunc4 = function(){
            this.waitForSettle = false;
            this.readyBtn.active = true;
            this.gameStart = false;
            this.joinLate = false;
            
            if(this.gameInfoNode.roomCurTime < this.gameInfoNode.roomMaxTime)
                    this.gameInfoNode.roomCurTime ++;
                this.gameInfoNode.roomTime.string = this.gameInfoNode.roomCurTime + " / " + this.gameInfoNode.roomMaxTime + "局";

            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true)
                    confige.roomPlayer[i].isReady = false;
            }
        };
        this.scheduleOnce(showSettleFunc4,3.5);
    },

    resetScene:function(){
        this.readyBtn.active = true;
        this.showCardBtn.active = false;
        this.showCardBtn2.active = false;

        this.timerItem.active = false;
    },

    //根据重连数据重现游戏状态
    recoverGame:function(){
        this.onReConnect = true;
        console.log("处理重连数据");
        console.log("当前参与游戏的人数===" + this.gamePlayerNode.playerCount);
        var watchPlayer = 0;
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == false)
            {   
                watchPlayer ++;
                if(i == this.meChair)
                    this.joinLate = true;
                console.log("有一个观战的玩家");
            }
        }
        this.gamePlayerNode.playerCount -= watchPlayer;

        if(confige.curReconnectData.freeState && confige.curReconnectData.freeState != false)
            this.gameInfoNode.onServerShowFinish(confige.curReconnectData.freeState);
        console.log("on recoverGame() !!!!!!!!!!!!!");
        this.gameInfoNode.roomMaxTime = confige.curReconnectData.roomInfo.maxGameNumber;
        //重置场景
        this.resetScene();
        console.log(confige.roomPlayer);
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(confige.roomPlayer[i].isReady == true)
                    this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));

                if(confige.roomPlayer[i].isOnline == false)
                    this.gamePlayerNode.leaveNodeList[confige.getCurChair(i)].active = true;
                else
                    this.gamePlayerNode.leaveNodeList[confige.getCurChair(i)].active = false;
            }
        }
        //重现当前玩家分数和显示庄家
        // console.log(confige.roomPlayer);
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(this.gamePlayerNode.playerActiveList[confige.getCurChair(i)] == false)
                {
                    console.log("this.playerActiveList === addone");
                    this.gamePlayerNode.addOnePlayer(confige.roomPlayer[i]);
                }
                this.gamePlayerNode.playerScoreList[i] = confige.curReconnectData.roomInfo.player[i].score - confige.curReconnectData.betList[i];

                this.gamePlayerNode.playerInfoList[confige.getCurChair(i)].setScore(this.gamePlayerNode.playerScoreList[i]);
                if(confige.curReconnectData.roomInfo.player[i].isBanker == true)
                {
                    this.gamePlayerNode.playerList[confige.getCurChair(i)].getChildByName("banker").active = true;
                    this.gamePlayerNode.lightBgList[confige.getCurChair(i)].active = true;
                    this.curBankerChair = i;//confige.getCurChair(i);
                    console.log("重连时庄家==="+this.curBankerChair);
                }
            }
        }
        this.gameInfoNode.roomCurTime = confige.curReconnectData.roomInfo.gameNumber;
        this.gameInfoNode.roomTime.string = this.gameInfoNode.roomCurTime + " / " + this.gameInfoNode.roomMaxTime + "局";
        //重现下注金额
        if(confige.curReconnectData.state != 1001)
        {
            this.readyBtn.active = false;

            //重现当前局数显示
            // this.gameInfoNode.roomCurTime = confige.curReconnectData.roomInfo.gameNumber;
            // this.gameInfoNode.roomTime.string = "第" + this.gameInfoNode.roomCurTime + "/" + this.gameInfoNode.roomMaxTime + "局";
            console.log("重连"+ this.gameInfoNode.roomTime.string);
            this.gameBegin = true;
            // this.gameInfoNode.btn_close.interactable = false;
            this.gameInfoNode.btn_inviteFriend.active = false;
        }else{
            //重现当前局数显示
            // this.gameInfoNode.roomCurTime = confige.curReconnectData.roomInfo.gameNumber + 1;
            // this.gameInfoNode.roomTime.string = "第" + this.gameInfoNode.roomCurTime + "/" + this.gameInfoNode.roomMaxTime + "局";
            console.log("重连"+ this.gameInfoNode.roomTime.string);
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    this.gamePlayerNode.playerList[confige.getCurChair(i)].getChildByName("isReady").active = true;
                    if(i == this.meChair)
                        this.readyBtn.active = false;
                }
            }
        }

        switch(confige.curReconnectData.state){
            case 1001:      //空闲阶段
                // this.statusChange(0);
                if(this.curBankerChair != -1){
                    this.gamePlayerNode.playerList[this.curBankerChair].getChildByName("banker").active = false;
                    this.gamePlayerNode.lightBgList[this.curBankerChair].active = false;
                }
                break;
            case 1002:      //下注阶段
                // this.statusChange(1);
                if(this.curBankerChair != this.meChair && this.joinLate == false)
                {
                    if(!this.isMingCardQZ)
                    {
                            this.betBtnBox.active = true;
                    }
                }
                break;
            case 1003:      //发牌阶段
                // this.statusChange(2);
                console.log("case 1003:!!!!!!!!");
                // console.log(confige.roomPlayer);
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {
                        this.gamePlayerNode.playerCardList[i] = confige.curReconnectData.roomInfo.player[i].handCard;
                        console.log("取出玩家的牌数据" + i)
                        console.log(this.gamePlayerNode.playerCardList[i]);
                        this.gamePlayerNode.playerHandCardList[confige.getCurChair(i)].initCardWithBack();
                        if(confige.roomPlayer[i].isShowCard == true)
                            this.gamePlayerNode.showOneCard(i);
                    }
                }
                if(this.joinLate == false)
                {
                    this.gamePlayerNode.showOneCard(this.meChair,-1);
                    this.btn_showMyCard();
                }
                //this.showCardBtn.active = true;
                break;
            case 1004:      //结算阶段
                // this.statusChange(0);
                break;
            case 1005:      //抢庄阶段
                // this.statusChange(1);
                if(this.gameMode == 1 && this.joinLate == false)
                    this.onServerRobBanker();
                break;
            case 1006:
                break;
        }

        if(this.cardMode == 2)          //明牌处理
        {
            if(confige.curReconnectData.state == 1002 && this.joinLate == false)
            {
                if(this.isMingCardQZ != true)
                    this.showMingCard(confige.curReconnectData.roomInfo.player[this.meChair].handCard);
            }
        }

        if(this.gameMode == 4){   //开船模式
            var dfsdfsdfsd = 0;
        }

        if(this.gameInfoNode.roomCurTime != 0)
        {
            this.gameInfoNode.btn_inviteFriend.active = false;
            this.gameBegin = true;
        }else{
            console.log("fuck roomCurTime === " + this.roomCurTime);
        }

        console.log("this.gameBegin======??????" + this.gameBegin);

        if(this.isMingCardQZ)
        {
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
                }
            }
            var curState = confige.curReconnectData.state;
            if(curState != 1005 && curState != 1001)
            {
                var robStateList = confige.curReconnectData.roomInfo.robState;
                for(var i in robStateList)
                {
                    if(robStateList[i] != -1)
                    {
                        if(robStateList[i] > this.curRobMaxNum)
                            this.curRobMaxNum = robStateList[i];
                    }
                }
                if(this.curRobMaxNum == 0)
                    this.curRobMaxNum = 1;
                this.robMaxNumNode.active = true;
                this.robMaxNumLabel.string = this.curRobMaxNum + ";<";
            }
            if(curState == 1005 || curState == 1002)
            {
                // this.newDisCard(4);
                var cardsCount = 0;
                for(var i in confige.curReconnectData.roomInfo.player)
                {
                    var curPlayerData = confige.curReconnectData.roomInfo.player[i]
                    if(curPlayerData.isActive == true && curPlayerData.isReady == true)
                    {
                        var curChair = confige.getCurChair(i);
                        this.gamePlayerNode.playerHandCardList[curChair].showCardBackWithCount(4);
                        console.log("重连直接显示玩家盖着的牌" + i);
                        if(curPlayerData.handCard)
                        {
                            var callFunc = function(){
                                for(var i in callFunc.cards)
                                {
                                    this.gamePlayerNode.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
                                }
                            };
                            callFunc.cards = curPlayerData.handCard;
                            callFunc.curChair = curChair;
                            this.scheduleOnce(callFunc,0.2);
                        }
                    }
                }
                if(curState == 1002)
                {
                    var betList = confige.curReconnectData.betList;
                    for(var i in betList)
                    {
                        if(i == this.meChair && i != this.curBankerChair && betList[i] == 0 && this.joinLate == false)
                        {
                            if(confige.curReconnectData.roomInfo.lastScore[this.meChair] > 0 && this.isAllowAllin)
                                this.robBetAllInBtn.interactable = true;

                            this.robBetBtnBox.active = true;
                            this.betBtnBox.active = false;
                        }
                    }   
                }else{
                    var robStateList = confige.curReconnectData.roomInfo.robState;
                    for(var i in robStateList)
                    {
                        this.gamePlayerNode.playerList[i].getChildByName("banker").active = false;
                        if(robStateList[i] != -1)
                        {
                            var curChair = confige.getCurChair(i);
                            if(robStateList[i] > this.curRobMaxNum)
                                this.curRobMaxNum = robStateList[i];
                            if(robStateList[i] == 0)
                                this.gamePlayerNode.noRobImgList[curChair].active = true;
                            else{
                                this.gamePlayerNode.robNumLabelList[curChair].string = ">?;"+robStateList[i];
                                this.gamePlayerNode.robNumNodeList[curChair].active = true;
                            }
                        }else{
                            if(parseInt(i) == this.meChair && this.joinLate == false)
                                this.robBtnBox.active = true;
                        }
                    }
                    // this.statusChange(2);
                }
            }   
        }

        confige.curReconnectData = -1;
    },

    connectCallBack:function(){

    },

    onNewGameStart:function(){
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(confige.roomPlayer[i].isReady == true)
                {
                    console.log("激活"+i+"号玩家发牌器");
                    this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
                }
                this.gamePlayerNode.bankerImgList[confige.getCurChair(i)].active = false;
            }
        }
        this.gameBegin = true;
        this.gameStart = true;
        this.meGiveUp = false;
        this.newResetCard();
        console.log("onNewGameStart");
        this.gameInfoNode.roomCurTime ++;
        this.gameInfoNode.roomTime.string = this.gameInfoNode.roomCurTime + " / " + this.gameInfoNode.roomMaxTime + "局";
        for(var i=0;i<confige.playerMax;i++)
        {
            this.gamePlayerNode.readyImgList[i].active = false;
        }
        // this.gameInfoNode.btn_inviteFriend.active = false;
        // this.gameInfoNode.btn_close.interactable = false;
        this.gamePlayerNode.playerCount = this.gamePlayerNode.newPlayerCount;
        this.gamePlayerNode.noShowCardCount = this.gamePlayerNode.playerCount;
        if(confige.roomData.gameMode != 3)
            this.showScorePool(0);
    },

    onNewGameBegin:function(data){
        this.gameStart = true;
        this.gamePlayerNode.playerCount = this.gamePlayerNode.newPlayerCount;
        console.log("onNewGameBegin" + this.gamePlayerNode.playerCount);
        this.allBetNum = 0;
        
        if(this.isMingCardQZ)
        {
            this.newDisCard(5);
            var cardsCount = 0;
            var totalTime = 0.3*this.gamePlayerNode.playerCount;
            for(var i in data.player)
            {
                if(data.player[i].isActive == true && data.player[i].isReady == true && data.player[i].handCard)
                {
                    var curChair = confige.getCurChair(i);
                    var callFunc = function(){
                        for(var i in callFunc.cards)
                        {
                            this.gamePlayerNode.playerHandCardList[callFunc.curChair].setCardWithIndex(i, callFunc.cards[i].num, callFunc.cards[i].type);
                        }
                        this.gamePlayerNode.playerHandCardList[callFunc.curChair].showCardBackWithIndex(4);
                    };
                    callFunc.cards = data.player[i].handCard;
                    callFunc.curChair = curChair;
                    this.scheduleOnce(callFunc,totalTime);
                }
            }
        }
        this.showScorePool(this.allBetNum);

        this.gamePlayerNode.resetScoreAni();
    },

    update: function (dt) {
        confige.CallGVoicePoll();
    },

    newDisCard:function(times){
        if(times == 1)
            this.gamePlayerNode.cardItemList.disCardOneRound();
        else
            this.gamePlayerNode.cardItemList.disCardWithRoundTime(times);
    },

    newResetCard:function(){
        this.gamePlayerNode.cardItemList.resetCardList();
        for(var i in confige.roomPlayer)
        {
            if(confige.roomPlayer[i].isActive == true)
            {
                if(confige.roomPlayer[i].isReady == true)
                    this.gamePlayerNode.cardItemList.activePlayer(confige.getCurChair(i));
            }
        }
    },
    
    openShare:function(){
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();
    },

    WXCancle:function(){
        if(confige.curOverLayer != -1)
            confige.curOverLayer.openShare();
    },

    initMingCardQZ:function(){
        this.isAllowAllin = true;
        this.isAllowAllin = confige.roomData.allowAllin;

        this.isMingCardQZ = true;
        
        this.robBtnBox = this.node.getChildByName("btnNode").getChildByName("robBtnBox");
        this.betBtnBox = this.node.getChildByName("btnNode").getChildByName("betBtnBox");

        // this.curRobMaxNum = 0;
        // this.robBetAllInBtn = this.robBetBtnBox.getChildByName("bet4").getComponent("cc.Button");
        // this.robMaxNumNode = this.gameBGNode.mainBg.getChildByName("curRobNum");
        // this.robMaxNumLabel = this.robMaxNumNode.getChildByName("robMaxNum").getComponent("cc.Label");

        // this.robBetNumNode = this.robMaxNumNode.getChildByName("curBet");
        // this.robBetNumLabel = this.robBetNumNode.getChildByName("robBetNum").getComponent("cc.Label");
    },

    btnClickRobBox:function(event,customEventData){
        var index = parseInt(customEventData);
        switch(index){
            case 1:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 1});
                break;
            case 2:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 2});
                break;
            case 3:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 3});
                break;
            case 4:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 4});
                break;
            case 0:
                pomelo.clientSend("useCmd",{"cmd" : "robBanker","num" : 0});
                break;
            case 11:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : 1});
                break;
            case 12:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : 2});
                break;
            case 13:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : 4});
            case 14:
                pomelo.clientSend("useCmd",{"cmd" : "bet","bet" : 5});
                break;
        }
        // this.robBtnBox.active = false;
    },

    showReConnect:function(){
        gameData.gameInfoNode.showReConnect();
        console.log("showReConnect!!!!!!!!!");
    },

    hideReConnect:function(){
        gameData.gameInfoNode.hideReConnect();
        console.log("hideReConnect!!!!!!!!!");
    },

    sayWithID:function(voiceID){
        pomelo.clientSend("say",{"msg": {"sayType":255, "id": voiceID, "time": this.gameInfoNode.sayTime}});
    },

    loadRes1:function(){
        var self = this;
        var onLoadNext = false;
        var loadCard = false;
        var loadNiutype = false;
        //cardFrame
        cc.loader.loadRes("prefabs/cardMapNode", cc.Prefab, function (err, prefabs) {
            var newNode = cc.instantiate(prefabs);
            self.resNode.addChild(newNode);
            confige.cardFrameMap[0] = newNode.getChildByName("card_00").getComponent("cc.Sprite").spriteFrame;
            for(var j=0;j<4;j++)
            {
                for(var i=1;i<=13;i++)
                {
                    var t = i;
                    if(i == 10)
                        t = 'a';
                    else if(i == 11)
                        t = 'b';
                    else if(i == 12)
                        t = 'c';
                    else if(i == 13)
                        t = 'd';
                    var index = i + j*13;
                    confige.cardFrameMap[index] = newNode.getChildByName("card_"+j+t).getComponent("cc.Sprite").spriteFrame;
                }
            }
            loadCard = true;
            if(loadCard == true && loadNiutype == true)
            {
                if(onLoadNext == false)
                {
                    onLoadNext = true;
                    self.loadLater();
                    self.startLater();
                    self.initAudio();
                    // self.loadRes2();
                }
            }
        });
        
        
        //niutypeFrame
        cc.loader.loadRes("prefabs/niutypeMapNode", cc.Prefab, function (err, prefabs) {
            var newNode = cc.instantiate(prefabs);
            self.resNode.addChild(newNode);
            for(var i=0;i<=14;i++)
            {
                var spriteFrame = newNode.getChildByName("niutype"+i).getComponent("cc.Sprite").spriteFrame;
                confige.niuTypeFrameMap[i] = spriteFrame;
            }
            loadNiutype = true;
            if(loadCard == true && loadNiutype == true)
            {
                if(onLoadNext == false)
                {
                    onLoadNext = true;
                    self.loadLater();
                    self.startLater();
                    self.initAudio();
                    // self.loadRes2();
                }
            }
        });
    },

    endRob:function(data){
        return;
        var bankerChair = data.banker;

        this.allBetNum = 0;
        this.myBetNum = 0;

        console.log("fuck joinLate =====!!!!!!!!!" + this.joinLate);
        this.statusChange(1);
        console.log("onServerBeginBetting111111");
        this.curBankerChair = bankerChair;
        if(bankerChair == this.meChair)
            this.showGameStatus(3);
        else
            this.showGameStatus(2);
      
        console.log("onServerBeginBetting222222");
        if(bankerChair != -1)
        {
            this.gamePlayerNode.bankerImgList[confige.getCurChair(bankerChair)].active = true;
            this.gamePlayerNode.lightBgList[confige.getCurChair(bankerChair)].active = true;
        }
        if(this.isMingCardQZ)
        {
            this.robBtnBox.active = false;
            if(this.joinLate == false && bankerChair != this.meChair)
                this.betBtnBox.active = true;
            for(var i in confige.roomPlayer)
            {
                if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                {
                    var curIndex = confige.getCurChair(i);
                    if(i != bankerChair){
                        this.gamePlayerNode.robNumNodeList[curIndex].active = false;
                        this.gamePlayerNode.noRobImgList[curIndex].active = false;
                    }
                }
            }
        }
        console.log("onServerBeginBetting333333");
        if(this.joinLate == false)
        {
            console.log("onServerBeginBetting311");
        }else{
            if(this.joinState == 1005 &&  this.cardMode == 2)
            {
                for(var i in confige.roomPlayer)
                {
                    if(confige.roomPlayer[i].isActive == true && confige.roomPlayer[i].isReady == true)
                    {
                        var curChair = confige.getCurChair(i);
                        if(curChair != 0)
                            this.playerHandCardList[curChair].showCardBackWithCount(3);
                    }
                }
            }
        }
        console.log("onServerBeginBetting444444");
    },
    // loadRes2:function(){
    //     var self = this;
    //     //faceFrame
    //     cc.loader.loadRes("prefabs/game/faceNode", cc.Prefab, function (err, prefabs) {
    //         var newNode = cc.instantiate(prefabs);
    //         self.resNode.addChild(newNode);
    //         for(var i=1;i<=12;i++)
    //         {
    //             confige.faceFrameMap[i-1] = newNode.getChildByName(""+i).getComponent("cc.Sprite").spriteFrame;
    //         }
    //         confige.loadFaceFrame = true;
    //     });
    //     //faceAni
    //     cc.loader.loadRes("prefabs/game/faceAniNode", cc.Prefab, function (err, prefabs) {
    //         var newNode = cc.instantiate(prefabs);
    //         self.resNode.addChild(newNode);
    //         for(var i=1;i<=6;i++)
    //             confige.faceAniMap[i] = newNode.getChildByName("faceAni"+i);
    //         confige.loadFaceAni = true;
    //     });

    //     this.initAudio();
    // },

    initAudio:function(){
        for(var i=0;i<=10;i++)
        {
            if(i >=3 && i<= 8)
            {
                cc.loader.loadRes("chat/" + i,function(index){
                    return  function (err, audio) {
                        var curIndex = "chat_" + index;
                        confige.audioList[curIndex] = audio;
                        console.log("curIndex===",curIndex);
                    }
                }(i));
            }
            if(i == 10)
            {
                cc.loader.loadRes("chat/" + i,function(index){
                    return  function (err, audio) {
                        var curIndex = "chat_" + index;
                        confige.audioList[curIndex] = audio;
                        console.log("curIndex===",curIndex);
                    }
                }(i));
            }

            // cc.loader.loadRes("sound/1/chat" + (i+1),function(index){
            //     return  function (err, audio) {
            //         var curIndex = "male_" + "chat_" + index;
            //         confige.audioList[curIndex] = audio;
            //     }
            // }(i));
        }
    },

    initRoomInfo:function(){
        this.roomInfoLayer = this.node.getChildByName("roomInfoLayer");
        this.labelMode = this.roomInfoLayer.getChildByName("mode").getComponent("cc.Label");
        this.labelBasic = this.roomInfoLayer.getChildByName("basic").getComponent("cc.Label");
        this.labelRule = this.roomInfoLayer.getChildByName("rule").getComponent("cc.Label");
        this.labelRound = this.roomInfoLayer.getChildByName("round").getComponent("cc.Label");
        this.labelPlayer = this.roomInfoLayer.getChildByName("player").getComponent("cc.Label");
        this.labelId = this.roomInfoLayer.getChildByName("id").getComponent("cc.Label");

        var self = this;
        if(confige.h5RoomID != "0")
        {
            pomelo.request("connector.entryHandler.getRoomInfo", {"roomId" : confige.h5RoomID}, function(data) {
                console.log("dealGetRoomInfo@@@@@"+confige.h5RoomID);
                console.log(data);
                self.roomInfoLayer.active = true;
                self.labelBasic.string = "底分：" + data.basic+"分"
                if(data.gameType == "mingpaiqz")
                    self.labelMode.string ="模式：" + "明牌抢庄";
                if(data.awardType == 0)
                    self.labelRule.string = "规则：牛牛x3牛九x2牛八x2 ";
                else if(data.awardType == 1)
                    self.labelRule.string = "规则：牛牛x4牛九x3牛八x2牛七x2 ";
                if(data.gameNumber == 10 || data.gameNumber == 12)
                {
                    self.labelRound.string = "局数：" + data.gameNumber + "局X1房卡";
                }
                if(data.gameNumber == 20 || data.gameNumber == 24)
                {
                    self.labelRound.string = "局数：" + data.gameNumber + "局X2房卡";
                }
                var roomIdStr = data.roomId.toString();
                roomIdStr = roomIdStr.substring(roomIdStr.length-6,roomIdStr.length);
                if(data.playerCount == 6)
                {
                    self.node.getChildByName("gameBg1").active = true;
                    document.title = "熟人六人牛牛(房间号:" + roomIdStr + ")";
                }else if(data.playerCount == 9){
                    self.node.getChildByName("gameBg2").active = true;
                    document.title = "熟人九人牛牛(房间号:" + roomIdStr + ")";
                }

                self.labelId.string = "你的大番薯ID:" + confige.curUseId;
                var newStr = "房间中有";
                if(data.playerInfo)
                {
                    for(var i in data.playerInfo)
                        newStr = newStr + data.playerInfo[i].nickname + ",";
                }
                newStr = newStr + "是否加入?";
                self.labelPlayer.string = newStr;

                if(data.playerInfo.length == 0)
                {
                    self.roomInfoLayer.active = false;
                    pomelo.clientSend("join",{"roomId":parseInt(confige.h5RoomID)}, function(data) {
                        console.log("join room111111 @@@@@@@@");
                        console.log(confige.h5RoomID);
                    });
                }
            });
        }
    },

    showRoomInfo:function(infoData){

    },

    btnCreateClick:function(){
        cc.director.loadScene('hallScene');
    },

    btnJoinClick:function(){
        pomelo.clientSend("join",{"roomId":parseInt(confige.h5RoomID)}, function(data) {
            console.log("join room111111 @@@@@@@@");
            console.log(confige.h5RoomID);
        });
    },

});