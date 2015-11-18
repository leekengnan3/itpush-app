/* global angular*/
'use strict';

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  var profileStr = localStorage.getItem('profile');
  var profile = JSON.parse(profileStr);
  console.log('in dash controller');
  $scope.fullname = profile.localFullname;
})

.controller('WelcomeCtrl', function($scope, $state) {
  var profileStr = localStorage.getItem('profile');
  if(profileStr !== null){
    $state.go('tab.dash');
  }
})

.controller('TabCtrl', function($scope, $http, ServerApi, Globals,$q,$rootScope,$state) {
  $scope.readMessage = function(){

    //todo read localstorage and getUnread message count
    $scope.rootUnreadMsgCount ='' ;

    var profileStr = localStorage.getItem('profile');
    var profile = JSON.parse(profileStr);
    var promise = ServerApi.getMyPushMessages($http, profile.userId, Globals,$q);

    promise.then(
      function(pushMessages){
        $scope.pushMessages = pushMessages;
      },
      function(error){
        console.log('Get push log error cause: '+error);
      }
    );
    $state.go('tab.chats');
  };

  $scope.showDashboard = function(){
      console.log('in showDashboard()');
      $state.go('tab.dash');
  };

  $rootScope.$on('rootScope:receivePush', function (event, data) {
    var unReadCount = parseInt($rootScope.unreadMsgCount);
    if(isNaN(unReadCount)){
      unReadCount = 0;
    }
    console.log('current unread message: '+ unReadCount);
    $scope.unreadMsgCount = (unReadCount + 1).toString();
    console.log('received: '+ JSON.stringify(data));
  });

})

.controller('MessageCtrl', function() {
  console.log('in MessageCtrl');
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
.controller('LoginCtrl', function($scope, $http, $state, ServerApi, Globals,$q) {
  console.log('in login ctrl');
  $scope.login = function(){
    var loginData = $scope.login;

    //to lower case for username
    loginData.username = loginData.username.toLowerCase();

    var authData = {
         username: loginData.username,
         password: loginData.password
        };
    var promise = ServerApi.adLogin($http, authData, Globals, ServerApi,$q);

    promise.then(
      function(profile){
        console.log('In LoginCtrl profile :'+ JSON.stringify(profile));
        $state.go('tab.dash');
      }, 
      function(error){
        console.log(error);
        $scope.showError = true;
      }
    );

    
  };// end of login method
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
