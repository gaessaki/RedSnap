angular.module('RedSnap')

    .controller('logoutController', function ($scope, $rootScope, $timeout, $state, Auth) {
    $scope.user = {}
    Auth.logout(function (err) {   
        console.log(err);
    })
    $rootScope.loggedIn = false; //Solely used to toggle ng-show
    $timeout(
        function () {
            $state.go('login')
        }, 2500);
})