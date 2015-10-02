// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, Globals) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }


    //added
    var pushReg = {userId: '', regId: '', 
                   devicePlatform: '',
                   deviceUuid: '',
                   isRegOnServer: false};

    document.addEventListener('deviceready', function(){
      pushReg.devicePlatform = device.platform;
      pushReg.deviceUuid = device.uuid;

    //push obj
      var push = PushNotification.init({ 'android': {'senderID': '65768580939'},
           'ios': {"alert": "true", "badge": "true", "sound": "true"}, 'windows': {} } );

      push.on('registration', function(data) {
          if (data.registrationId.length > 0 ) {
                console.log('registration ID = ' + data.registrationId);
                pushReg.regId = data.registrationId;
        }
        localStorage.setItem('pushReg', JSON.stringify(pushReg));
      });

      //
      push.on('notification', function(data) {
          // data.message,
          // data.title,
          // data.count,
          // data.sound,
          // data.image, 
          // data.additionalData
          console.log('message = ' + data.message + ' msgCount = ' + data.count);
      });

      push.on('error', function(e) {
          console.log('GCM error = ' + e);
      });
    }, false);
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  //cors
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // Welcome Page
  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html'
  })

  // Login Page
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

});
