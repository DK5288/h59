var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        oriItem:{
            default:null,
            type:cc.Node
        },
        isInit:false,
    },

    // use this for initialization
    onLoad: function () {
        this.colorWin = new cc.Color(221,183,82);
        this.colorLose = new cc.Color(231,220,191);
        this.roomid = this.node.getChildByName("roomid").getComponent("cc.Label");
        this.time = this.node.getChildByName("time").getComponent("cc.Label");
        this.roomround = this.node.getChildByName("roomround").getComponent("cc.Label");

        this.overContent = this.node.getChildByName("scrollView").getChildByName("view").getChildByName("content");

        this.beginY = -80;
        this.offsetY = -150;
        console.log("show over 111111")
        if(confige.overData != null){
            console.log("show over 2222222")
            this.onInitWithData(confige.overData.player);

            var sortNum = confige.overData.roomId.toString();
            sortNum = sortNum.substring(sortNum.length-6,sortNum.length)
            this.roomid.string = "房间号:"+sortNum;
            var curDate = new Date(confige.overData.endTime)
            var Time1 = curDate.getFullYear()+"-"+(parseInt(curDate.getMonth())+1)+"-"+curDate.getDate();
            var Time2 = curDate.getHours()+":"+curDate.getMinutes()+":"+curDate.getSeconds();
            this.time.string = "" + Time1 + "   " + Time2;
            if(confige.overData.maxGameNumber)
                this.roomround.string = ""+confige.overData.maxGameNumber+"局";
            if(confige.overData.gameNumber)
                this.roomround.string = ""+confige.overData.gameNumber+"局";
        }
    },

    onInitWithData:function(overData){
        console.log("onInitWithData@@@@@@@@@@@@@@");
        console.log(overData);
        var itemList = {};
        var newOverItemCount = 0;
        var maxScore = 0;
        var maxIndex = 0;
        for(var i in overData)
        {
            var newPlayerData = overData[i];
            if(newPlayerData.isActive)
            {
                if(newPlayerData.isActive == true)
                {
                    newOverItemCount ++;
                    var newOverItem = cc.instantiate(this.oriItem);
                    itemList[i] = newOverItem;
                    this.overContent.addChild(newOverItem);
                    newOverItem.y = this.beginY + this.offsetY * i;
                    if(newPlayerData.score > maxScore)
                    {
                        maxScore = newPlayerData.score;
                        maxIndex = i;
                    }
                    if(newPlayerData.score >= 0)
                    {
                        newOverItem.getChildByName("score").color = this.colorWin;
                        newOverItem.getChildByName("score").getComponent("cc.Label").string = "+"+newPlayerData.score;
                    }else{
                        newOverItem.getChildByName("score").color = this.colorLose;
                        newOverItem.getChildByName("score").getComponent("cc.Label").string = newPlayerData.score;
                    }
                    newOverItem.getChildByName("nick").getComponent("cc.Label").string = newPlayerData.playerInfo.nickname;
                }
            }else{
                newOverItemCount ++;
                var newOverItem = cc.instantiate(this.oriItem);
                itemList[i] = newOverItem;
                this.overContent.addChild(newOverItem);
                newOverItem.y = this.beginY + this.offsetY * i;
                if(newPlayerData.score > maxScore)
                {
                    maxScore = newPlayerData.score;
                    maxIndex = i;
                }
                if(newPlayerData.score >= 0)
                {
                    newOverItem.getChildByName("score").color = this.colorWin;
                    newOverItem.getChildByName("score").getComponent("cc.Label").string = "+"+newPlayerData.score;
                }else{
                    newOverItem.getChildByName("score").color = this.colorLose;
                    newOverItem.getChildByName("score").getComponent("cc.Label").string = newPlayerData.score;
                }
                newOverItem.getChildByName("nick").getComponent("cc.Label").string = newPlayerData.name;
            }
        }
        console.log("maxIndex===="+maxIndex);
        itemList[maxIndex].getChildByName("overWinIco").active = true;
        this.overContent.height = 300 + newOverItemCount * 150;
    },
});
