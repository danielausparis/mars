var myApp = angular.module('myApp', ['ui.router', 'ngSanitize']);


myApp.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('home', {
       url: '/home',
       templateUrl: 'index.html'
    })

    .state('waiting', {
       url: '/waiting',
       templateUrl: 'waiting.html'
    })

    .state('running', {
       url: '/running',
       templateUrl: 'running.html'
    });

    $urlRouterProvider.otherwise('home');

});

// NO CACHE
myApp.run(['$templateCache', function ( $templateCache ) {
    $templateCache.removeAll(); }]);
