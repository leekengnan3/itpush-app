'use strict';

angular.module('starter.services', [])
.factory('Globals', function() {
  return {
    appId: 'com.testritegroup.app.testriteItPush',
    apiServer: 'http://127.0.0.1:8080'
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

        console.log(postData);

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
    adLogin: function($http, authData, Globals, ServerApi, q){
        var defer = q.defer();
         var requestData = {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          url: Globals.apiServer+'/adAuth',
          data: authData
        };
        
        $http(requestData).then(
          function(response){
            //success
            console.log(response);
            console.log(response.responseCode);

            if(response.data.reponseCode === 200){
                  var adProfile = response.data.data;
                  console.log('Login succcess!');
                  var profile = {
                    username: adProfile.userId,
                    email: adProfile.email,
                    userId: adProfile.userId,
                    title: adProfile.title,
                    tel: adProfile.tel,
                    localFullname: adProfile.displayName,
                    company: adProfile.company,
                    country: adProfile.co
                };

                localStorage.setItem('profile', JSON.stringify(profile));

                // get update reg to server
                ServerApi.pushRegistration($http, authData.username, Globals.apiServer, Globals.appId);
                defer.resolve(profile);
            }else{
              defer.reject('password wrong!');
            }
          },
          function(error){
            defer.reject(error);
          }
        );

        return defer.promise;
    },
    getMyPushMessages: function($http, userId, Globals, $q){
      var requestData = {
          method: 'GET',
          headers: {
            'Content-Type': 'text/plain'
          },
          url: Globals.apiServer+'/pushLog/'+userId+'/appId/'+Globals.appId+'/'
        };

      var defer = $q.defer();



      $http(requestData).then(
          function(response){
            //success
            if(response.data.reponseCode === 200){
                return defer.resolve(response.data.data);
            }else{
              console.log('get push log error!');
              defer.reject('get push log error!');
            }
          },
          function(error){
            //fail
            defer.reject(error);
          }
        );

      return defer.promise;
    }
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
