/* global angular*/
'use strict';

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

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
.controller('LoginCtrl', function($scope, $http, Globals, $state) {
  console.log('in login ctrl');

  

  $scope.login = function(){
    var loginData = $scope.login;
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

    var pushReg = JSON.parse(localStorage.getItem('pushReg'));
    
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
            if(pushReg !==null){
              var postData={'userId': loginData.username,
              'appId': Globals.appId,
              'uuid':pushReg.deviceUuid,
              'devicePlatform':pushReg.devicePlatform,
              'regId':pushReg.regId};

              $http.post(Globals.apiServer+'/pushRegister',postData).then(function(){
                console.log('Registraition On Server Success!');
                  //post success
                  if(pushReg !== null){
                    pushReg.userId = loginData.username;
                    pushReg.isRegOnServer = true;
                    localStorage.setItem('pushReg', JSON.stringify(pushReg));
                  }
                }, function(){
                  console.log('Registraition On Server Failed!');
              });
            }
            
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
