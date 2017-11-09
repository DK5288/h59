var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.joinNode = this.node.getChildByName("joinNode");
        this.roomNum = this.joinNode.getChildByName("roomNum").getComponent("cc.EditBox");
    },

    btnClickWithIndex:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 0)  //tohall
        {
            cc.director.loadScene('hallScene');
        }  
        if(index == 1)  //touser
        {
            cc.director.loadScene('userScene');
        }
        if(index == 2)  //togame
        {
            this.joinNode.active = true;
        }
    },

    btnJoinClick:function(){
        var curRoomID = parseInt(this.roomNum.string);
        console.log("curRoomID === "+curRoomID);

        pomelo.request("connector.entryHandler.getRoomInfo", {"roomId" : curRoomID}, function(data) {
            console.log(data);
            if(data.roomId)
            {
                confige.h5RoomID = data.roomId;
                cc.director.loadScene('gameScene');
            }else{
                console.log("data ===== {}");
            }
        });
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
