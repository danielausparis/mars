var myApp = angular.module('myApp', ['ui.router', 'ngSanitize', 'ngCookies']);



myApp.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('home', {
       url: '/home',
       templateUrl: 'home.html'
    })

    .state('polls', {
       url: '/polls',
       templateUrl: 'polls.html'
    })

    .state('sessionlist', {
       url: '/sessionlist',
       templateUrl: 'sessionlist.html'
    })

    .state('login', {
       url: '/login',
       templateUrl: 'login.html'
    })

    .state('registration', {
       url: '/registration',
       templateUrl: 'registration.html'
    })

    .state('addpoll', {
       url: '/addpoll',
       templateUrl: 'addpoll.html'
    })

    .state('editpoll', {
       url: '/editpoll',
       params : {
         pollid : null,
         polltitle : null,
         canwrite : null
       },
       templateUrl: 'editpoll.html'
    })

    .state('editquestion', {
       url: '/editquestion',
       params : {
         new : null,
         pollid : null,
         question : null,
         polltitle : null,
         canwrite : null
       },
       templateUrl: 'editquestion.html'
    })

    .state('session-start', {
       url: '/session-start',
       templateUrl: 'session-start.html'
    })

    .state('groupsession', {
       url: '/group-session',
       templateUrl: 'session-group-session.html'
    })

    .state('groupsessionresults', {
      url: '/group-session-results',
      templateUrl: 'results.html'
    })

    .state('useradmin', {
       url: '/useradmin',
       templateUrl: 'useradmin.html'
    })

    .state('help', {
       url: '/help',
       templateUrl: 'help.html'
    })

    .state('about', {
       url: '/about',
       templateUrl: 'about.html'
    });

    $urlRouterProvider.otherwise('home');

});

// NO CACHE
myApp.run(['$templateCache', function ( $templateCache ) {
    $templateCache.removeAll(); }]);
