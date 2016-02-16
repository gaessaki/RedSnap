angular.module('RedSnap')
  .controller('loginController', function ($scope, $rootScope, Auth, $location) {
    $scope.user = {};
    
    $scope.login = function () {
        console.log('attempting log in')
        Auth.login($scope.user,
        function (err) {
            $scope.errors = [];
            
            if (!err) {
                $rootScope.loggedIn = true;
                $location.path('/');
            } else {
                angular.forEach(err.errors, function (error, key) {
                    $scope.errors.push(error)
                })
                //angular.forEach(err.errors, function (error, field) {
                //    form[field].$setValidity('mongoose', false);
                //    $scope.errors[field] = error.type;
                //});
            }
        });
    };
});
