var confige = require("confige");

cc.Class({
    extends: cc.Component,

    properties: {
        isInit:false,
    },

    // use this for initialization
    onLoad: function () {

    },

    onInit:function(){
        this.toggleMusic = this.node.getChildByName("toggle1").getComponent("cc.Toggle");
        this.toggleSound = this.node.getChildByName("toggle2").getComponent("cc.Toggle");
        this.toggleMusicLabel = this.node.getChildByName("toggle1").getChildByName("tips").getComponent("cc.Label");
        this.toggleSoundLabel = this.node.getChildByName("toggle2").getChildByName("tips").getComponent("cc.Label");

        if(confige.musicEnable == true){
            this.toggleMusic.isChecked = true;
            this.toggleMusicLabel.string = "开启";
        }
        else{
            this.toggleMusic.isChecked = false;
            this.toggleMusicLabel.string = "关闭";
        }

        if(confige.soundEnable == true){
            this.toggleSound.isChecked = true;
            this.toggleSoundLabel.string = "开启";
        }
        else{
            this.toggleSound.isChecked = false;
            this.toggleSoundLabel.string = "关闭";
        }

        this.btnRefresh = this.node.getChildByName("btnRefresh");
        this.isInit = true;
    },

    onBtnClick:function(event, customEventData){
        var clickIndex = parseInt(customEventData);
        if(clickIndex == 0)
        {
            if(confige.musicEnable == true){
                this.toggleMusic.isChecked = false;
                this.toggleMusicLabel.string = "关闭";
                confige.musicEnable = false;
            }
            else{
                this.toggleMusic.isChecked = true;
                this.toggleMusicLabel.string = "开启";
                confige.musicEnable = true;
            }
            // cc.audioEngine.stop(confige.audioBgId);
            // confige.audioBgId = cc.audioEngine.play(confige.audioList["bgm"],true,confige.audioVolume);
        }else if(clickIndex == 1){
            if(confige.soundEnable == true){
                this.toggleSound.isChecked = false;
                this.toggleSoundLabel.string = "关闭";
                confige.soundEnable = false;
                console.log("soundEnable=====false")
            }
            else{
                this.toggleSound.isChecked = true;
                this.toggleSoundLabel.string = "开启";
                confige.soundEnable = true;
                console.log("soundEnable=====true")
            }
        }
        this.saveSetting();
    },

    showSetting:function(){
        this.node.active = true;
    },

    hideSetting:function(){
        this.node.active = false;
    },

    saveSetting:function(){
        var userSetting = {
            musicEnable : confige.musicEnable,
            soundEnable : confige.soundEnable
        };
        cc.sys.localStorage.setItem('userSetting', JSON.stringify(userSetting));
        var userSetting = JSON.parse(cc.sys.localStorage.getItem('userSetting'));
        console.log(userSetting);
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.node.active = true;
    },

    hideLayer:function(){
        this.node.active = false;
    },
});
