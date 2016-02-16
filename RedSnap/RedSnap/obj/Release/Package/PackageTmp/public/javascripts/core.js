'use strict';

angular.module('RedSnap', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngSanitize', 'ngResource', 'ngAnimate', 'webcam', 'http-auth-interceptor'])
.config(function ($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('main', {
        url: '/',
        templateUrl: '/views/main.html',
        controller: 'mainController',
        resolve: {
            authenticate: function (Auth) {
                return Auth.authenticate();
            }
        }
    })
        .state('cam', {
        abstract: true,
        url: '/cam',
        template: '<ui-view/>',
        controller: 'camController',
        resolve: {
            authenticate: function (Auth) {
                return Auth.authenticate();
            }
        }
    })
        .state('cam.view', {
        url: '/view',
        templateUrl: '/views/cam/view.html',
        controller: 'camViewController'
    })
        .state('cam.draw', {
        url: '/draw',
        templateUrl: '/views/cam/draw.html',
        controller: 'camDrawController'
    })
        .state('friends', {
        url: '/friends',
        templateUrl: '/views/friends.html',
        controller: 'friendsController',
        resolve: {
            authenticate: function (Auth) {
                return Auth.authenticate();
            }
        }
    })
        .state('login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'loginController'
    })
        .state('logout', {
        url: '/logout',
        templateUrl: '/views/logout.html',
        controller: 'logoutController'
    })
        .state('register', {
        url: '/register',
        templateUrl: '/views/register.html',
        controller: 'registerController'
    })
})
.run(function ($rootScope, $state, $location, Auth) {
    $rootScope.$watch('currentUser', function (currentUser) {
        if (!$rootScope.currentUser && !$state.includes('login')) {
            Auth.currentUser();
        }
    });
    //On 401, redirect to login, implements http-auth-interceptor
    $rootScope.$on('event:auth-loginRequired', function () {
        $rootScope.loggedIn = false;
        $location.path('/login')
        return false;
    })
});