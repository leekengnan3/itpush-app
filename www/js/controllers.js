/* global angular*/
'use strict';

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('WelcomeCtrl', function($scope, $state) {
  var profileStr = localStorage.getItem('profile');
  if(profileStr !== null){
    $state.go('tab.dash');
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
.controller('LoginCtrl', function($scope, $http, $state, ServerApi, Globals) {
  console.log('in login ctrl');
  $scope.login = function(){
    var loginData = $scope.login;

    //to lower case for username
    loginData.username = loginData.username.toLowerCase();

    var requestData = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      url: Globals.apiServer+'/adAuth',
      data:{
         username: loginData.username,
         password: loginData.password
        }
    };
    
    $http(requestData).then(
      function(response){
        //success
        if(response.data === 'true'){
              console.log('Login succcess!');
              var profile = {
                username: loginData.username,
                email: '',
                firstName: '',
                lastName: '',
                title:'',
                tel:'',
                localFullname:'',
                company:'',
                country:''
            };

            localStorage.setItem('profile', JSON.stringify(profile));

            // get update reg to server
            ServerApi.pushRegistration($http, loginData.username, Globals.apiServer, Globals.appId);
            
            // to home
            $state.go('tab.dash');
        }else{
          console.log('password wrong!');
          $scope.showError = true;
        }
      },
      function(error){
        //fail
        console.log('Call url Error '+JSON.stringify(error));
      }
    );
  };// end of login method
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
