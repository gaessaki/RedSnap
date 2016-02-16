angular.module('RedSnap')

    .controller('registerController', function ($location, $scope, Auth) {
    $scope.formData = {};
    
    $scope.register = function () {
        if ($scope.formData.username != undefined) {
            Auth.register($scope.formData, function (err) {
                $scope.errors= {}

                if (!err) {
                    $location.path('/')
                }
                else {
                    console.log(err)

                }
            });

        }
    }
        
});