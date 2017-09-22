var COMB_TYPE_NONE  =   0            // 牛破
var COMB_TYPE_OX1   =    1           // 牛1
var COMB_TYPE_OX2   =    2           // 牛2
var COMB_TYPE_OX3   =    3           // 牛3
var COMB_TYPE_OX4   =    4           // 牛4
var COMB_TYPE_OX5   =    5           // 牛5
var COMB_TYPE_OX6   =    6           // 牛6
var COMB_TYPE_OX7   =    7           // 牛7   
var COMB_TYPE_OX8   =    8           // 牛8   x2
var COMB_TYPE_OX9   =    9           // 牛9   x3
var COMB_TYPE_OX10  =    10          // 牛牛  x4
var COMB_TYPE_YIN_DELUX =    11      // 银花牛x5
var COMB_TYPE_JIN_DELUX =    12      // 金花牛x6
var COMB_TYPE_BOMB  =    13          // 炸弹  x7
var COMB_TYPE_MICRO =    14          // 五小  x8

var cfg = {
    userInfo : {
        diamond : -1,
    uid : -1,
    nickname :-1,
    head : -1,
    history : -1,
    sex : -1,
    playerId : -1
    },

  useNewMode : true,
  host : 0,
  port : 0,
  loginFirstTime : true,
  curUID : 0,
  meChair : 0,
  curPlayerCount : 0,
  curPlayerMax : 0,
  playerMax : 6,
  curPlayerData : {},   //转换之后的数据
  getCurChair : function(newChair){   //获取转换过后的椅子,客户端椅子号s
    newChair = parseInt(newChair);
    return (newChair + cfg.playerMax - cfg.meChair) % cfg.playerMax;
  },
  getOriChair : function(newChair){   //获取转换过前的椅子,服务端原始椅子号;
    newChair = parseInt(newChair);
    return (newChair + cfg.meChair) % cfg.playerMax;
  },
  addPlayerLateList : {},
  addPlayerLateCount : 0,

  addOnePlayerLate : function(playerData){
    cfg.addPlayerLateList[cfg.addPlayerLateCount] = playerData;
    cfg.addPlayerLateCount ++;
  },
  curDiamond : -1,
  curHistory : {},
  curSex : 1,   //1:M,0:F;

    roomPlayer : -1,
  roomId : -1,
  roomData : -1,
  cardFrameMap : {},
  niuTypeFrameMap : {},
  niuTypeFrameMapFK : {},
  sanKungTypeFrameMap : {},
  jinHuaTypeFrameMap : {},

  faceFrameMap : {},
  faceAniMap : {},
  loadFaceAni : false,
  loadFaceFrame : false,

  cardBackFrame : -1,
  noticeData : -1,

  audioBgId : null,
  audioList : [],
  audioVolume : 1,
  musicEnable : true,
  soundEnable : true,
  gameSceneLoadOver : false,
  gameSceneLoadData : [],
  hallSceneLoadData : [],

  playerLimits : -1,
  curUseId : -1,
  curUseToken : -1,
  curUseCode : -1,
  firstShowNotice : true,

  GVoiceIsInit : false,
  GVoiceRoomID : -1,


  enterSceneIndex : 0,


  loadNode : {},
  curGameScene : {},
  ON_LOGIN : 1000,
  ON_HALL : 1001,
  ON_GAME : 1002,
  ON_OVER : 1005,
  curReconnectType : 1000,
  curReconnectData : -1,
  curUsePlatform : -1,       //0:webjs,1:android,2:ios;
  curOverLayer : -1,
    curSceneIndex : 0          //0:login;1:hall;2:game;
};


cfg.curVersion = "1.3.73";
cfg.oriPaomaText = "和谐游戏，拒绝赌博，如若发现，封号并提交公安机关处理。有事咨询客服，客服微信号：YCYX1818";
cfg.versionCheck = "1.3.501&LKSADHFKASKDJLSAFDHJ";
cfg.resetGameData = function(){
  cfg.gameSceneLoadData = [];
  cfg.curReconnectData = -1;
  cfg.curSceneIndex = 1;
  cfg.roomPlayer = -1;
  cfg.roomId = -1;
  cfg.roomData = -1;
  cfg.meChair = 0;
  cfg.curPlayerCount = 0;
  cfg.curPlayerMax = 0;
  cfg.curPlayerData = {};
},

//h5
cfg.h5InviteCode = "0";
cfg.h5RoomID = "0";
cfg.h5SignID = "wxd72486a200bde1db";
cfg.h5SignTime = "";
cfg.h5SignTicket = "";
cfg.h5SignSignature = "";
cfg.h5SignStr = "niuniuH5";
cfg.h5SignURL = "";
cfg.h5LoginUrl = "http://pay.5d8d.com/H5Index/nnH5?room_num=0";
cfg.h5ShareUrlNew = "http://pay.5d8d.com/H5Index/nnH5?room_num=ROOMNUM";
cfg.h5ShareIco = "http://update.5d8d.com/niuniuH5/MP_ICO.png";
console.log("分享路径22222===="+cfg.h5ShareUrlNew);
console.log("完整路径222===="+cfg.h5SignURL + cfg.h5ShareIco);
//
cfg.loginType = 0;   //0:游客登陆;1:微信登陆;2:h5微信登录
cfg.h5ShareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd72486a200bde1db&redirect_uri=http%3a%2f%2fpay.5d8d.com%2fNN%2fnnH5%3froom_num%3dROOMNUM&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
// cfg.code_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0e81c3bee622d60&redirect_uri=http%3A%2F%2Fnba.bluewebgame.com%2Foauth_response.php&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect ";
cfg.access_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";
cfg.refresh_token_url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN";
cfg.APP_ID = "wxdddfd25ee2f85f5d";
cfg.SECRET = "b81ac4bd43c1662c62b3e5abe89a0ef0";
cfg.WX_CODE = "";
cfg.WX_ACCESS_TOKEN = "";
cfg.WX_OPEN_ID = "";
cfg.WX_UNIONID = "";
cfg.WX_LOGIN_RETURN = "";
cfg.WX_REFRESH_TOKEN = "";

cfg.meWXHeadFrame = -1;
cfg.WXHeadFrameList = {};

//
cfg.payURL = "http://pay.5d8d.com/index.php/Tips/showpay";
cfg.shareURL = "http://d.5d8d.com/index.php/Download/niuniu2"; //"http://game.37yiyou.cn/download/nngame/download.html?from=groupmessage";
cfg.shareTitle = "我爱牛牛,点击可玩,无需下载";
cfg.shareDes = "我爱牛牛H5,安全无挂,放心畅玩!";
//
cfg.playSoundByName = function(curName){
  if(cfg.audioList[curName])
    cc.audioEngine.play(cfg.audioList[curName],false,cfg.audioVolume);
};

cfg.getWXHearFrame = function(headUrl,index,cb) {
  console.log("WXHead index 1111111111111111111");
  // headUrl = headUrl + ".jpg";
  cc.loader.load({url:headUrl,type:'png'}, function (err, texture) {
    //console.log("WXHead URL === " + headUrl);
    console.log("WXHead index === " + index);
    var newFrame = new cc.SpriteFrame(texture);
    if(index == 0)
    {
      cfg.meWXHeadFrame = newFrame;
      cfg.WXHeadFrameList[index] = newFrame;
    }
    else{
      cfg.WXHeadFrameList[index] = newFrame;
    }

    if(cb)
      cb();
  });
};

cfg.CallGVoicePoll = function(){
  if(cfg.GVoiceIsInit == true)
    if(cfg.curUsePlatform == 1)
      jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoicePoll", "()V");
    else
      jsb.reflection.callStaticMethod("JSCallOC","GVoicePoll");
};

cfg.GVoiceCall = {
  init : function(openID){
    if(cfg.GVoiceIsInit == false){
        var appid = "1065028827";
        var appkey = "93242afbf1258ddd2a8d5a766285268d";
        var openid = openID;
        if(cfg.curUsePlatform == 1){
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceInit", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", appid, appkey, openid);
        }else if(cfg.curUsePlatform == 2){
          jsb.reflection.callStaticMethod("JSCallOC", "openGvoiceEngineAppID:andKey:andOpenID:", appid, appkey, openid);  
        }
        cfg.GVoiceIsInit = true;
    }
  },

  joinRoom : function(roomID){
    if(cfg.curUsePlatform == 1){
      jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceJoinRoom", "(Ljava/lang/String;)V", roomID);
    }else if(cfg.curUsePlatform == 2){
      jsb.reflection.callStaticMethod("JSCallOC", "GVoiceJoinRoom:", roomID);
    }
  },

  quitRoom : function(roomID){
    if(cfg.curUsePlatform == 1){
      jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceQuitRoom", "(Ljava/lang/String;)V", roomID);
    }else if(cfg.curUsePlatform == 2){
      jsb.reflection.callStaticMethod("JSCallOC", "GVoiceQuitRoom:", roomID);
    }
  },

  openListen : function(){
    if(cfg.curUsePlatform == 1){
      jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceListenOpen", "()V");
    }else if(cfg.curUsePlatform == 2){
      jsb.reflection.callStaticMethod("JSCallOC", "GVoiceListenOpen");
    }
  },

  closeListen : function(){
    if(cfg.curUsePlatform == 1){
      jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceListenClose", "()V");
    }else if(cfg.curUsePlatform == 2){
      jsb.reflection.callStaticMethod("JSCallOC", "GVoiceListenClose");
    }
    
  },

  openMic : function(){
    if(cfg.curUsePlatform == 1){
      jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceMicOpen", "()V");
    }else if(cfg.curUsePlatform == 2){
      jsb.reflection.callStaticMethod("JSCallOC", "GVoiceMicOpen");
    }
  },

  closeMic : function(tag){
    if(cfg.curUsePlatform == 1){
      jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "GVoiceMicClose", "(I)V",tag);
    }else if(cfg.curUsePlatform == 2){
      jsb.reflection.callStaticMethod("JSCallOC", "GVoiceMicClose");
    }
  }
};

cfg.getNiuType = function(handCard) {
      //type 特殊类型  0:无;  1 : 牛牛; : 2 : 五花; 3 : 五小;4 : 炸弹;
      var result = {
        "type" : 0,                       
        "card" : {},
        "award": 1,
        "Comb" : {}
      }
      //先找出最大的单张牌
      result.card = handCard[0]
      for(var i = 1;i < 5;i++){
          if(handCard[i].num > result.card.num || (handCard[i].num == result.card.num && handCard[i].type > result.card.type)){
              result.card = handCard[i]
          }
      }
      //五小牛
      if((handCard[0].num + handCard[1].num + handCard[2].num + handCard[3].num + handCard[4].num) <= 10){
          result.type = COMB_TYPE_MICRO
          result.award = 8
          return result
      }

      //炸弹
      var count = 0
      for(var i = 0;i < 5;i++){
        count = 1
        for(var j = 0;j < 5;j++){
          if(i != j && handCard[i].num === handCard[j].num){
              count++
          }
        }
        if(count === 4){
          result.type = COMB_TYPE_BOMB
          result.card = handCard[i]
          result.award = 7
          return result
        }
      }
      //银花牛
      var flag = true
      var yinniuCount = 0
      for(var i = 0;i < 5;i++){
        if(handCard[i].num < 10){
          flag = false
          break
        }else if(handCard[i].num === 10){
          yinniuCount++
        }
      }
      if(flag === true && yinniuCount === 1){
          result.type = COMB_TYPE_YIN_DELUX
          result.award = 5
          return result 
      }
      //五花牛
      flag = true
      for(var i = 0;i < 5;i++){
        if(handCard[i].num < 11){
          flag = false
        }
      }
      if(flag === true){
          result.type = COMB_TYPE_JIN_DELUX
          result.award = 6
          return result 
      }
      var __card_val = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 10, 10]
      var allComb = [
        [0,1,2,3,4],
        [0,1,3,2,4],
        [0,1,4,2,3],
        [0,2,3,1,4],
        [0,2,4,1,3],
        [0,3,4,1,2],
        [1,2,3,0,4],
        [1,2,4,0,3],
        [1,3,4,0,2],
        [2,3,4,0,1]
      ]

      for(var i=0; i<10; ++i){
          if(((__card_val[handCard[allComb[i][0]].num] + __card_val[handCard[allComb[i][1]].num] + __card_val[handCard[allComb[i][2]].num]) % 10) == 0){
              result.type = COMB_TYPE_NONE + (__card_val[handCard[allComb[i][3]].num] + __card_val[handCard[allComb[i][4]].num]) % 10
              if(result.type === 0){
                result.type = COMB_TYPE_OX10
                result.award = 4
              }else if(result.type === 9){
                result.award = 3
              }else if(result.type === 8){
                result.award = 2
              }
              result.Comb = allComb[i]
              break
          }
      }
      return result
};

cfg.getDayCount = function(){
  var newDate = Date.parse(new Date());
  var curDayCount = parseInt(newDate/1000/86400);
  return curDayCount;
};

module.exports = cfg;