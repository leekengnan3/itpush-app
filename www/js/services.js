'use strict';

angular.module('starter.services', [])
.factory('Globals', function() {
  return {
    appId: 'com.testritegroup.app.testriteItPush',
    apiServer: 'http://service.testritegroup.com/api'
  };
})
.factory('ServerApi', function() {
  return {
    pushRegistration: function($http, username, apiServer, appId){
      var pushReg = JSON.parse(localStorage.getItem('pushReg'));
      // get update reg to server
      if(pushReg !==null){
        var postData={'userId': username,
        'appId': appId,
        'uuid':pushReg.deviceUuid,
        'devicePlatform':pushReg.devicePlatform,
        'regId':pushReg.regId,
        'deviceModel':pushReg.deviceModel,
        'osVersion':pushReg.osVersion,
        'browserCodeName':pushReg.browserCodeName,
        'browserName':pushReg.browserName,
        'browserVersion':pushReg.browserVersion,
        'browserLanguage':pushReg.browserLanguage,
        'browserUserAgent':pushReg.browserUserAgent};

        $http.post(apiServer+'/pushRegister',postData).then(function(){
          console.log('Registraition On Server Success!');
            //post success
            if(pushReg !== null){
              pushReg.userId = username;
              pushReg.isRegOnServer = true;
              localStorage.setItem('pushReg', JSON.stringify(pushReg));
            }
          }, function(e){
            console.log('Registraition On Server Failed! ' + JSON.stringify(e));
        });
      }
    },
    apiServer: 'http://service.testritegroup.com/api'
  };
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
;
