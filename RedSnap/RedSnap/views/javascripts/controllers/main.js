angular.module('RedSnap')
    .controller('mainController', function ($scope, $interval, $uibModal, SnapService) {
    
    $scope.snaps = {};
    $scope.snapData = {}
    var time = 0;
    
    
    SnapService.listSnaps(function (snaps) {
        $scope.snaps = snaps;
    })
    
    $scope.open = function (snapRequestData) {
        
        SnapService.viewSnap(snapRequestData, function (snap) {
            $scope.snapData = snap
            time = $scope.snapData.time;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../../views/snapModal.html',
                controller: 'snapModalController',
                keyboard: true,
                scope: $scope
            })
            
            SnapService.listSnaps(function (snaps) {
                $scope.snaps = snaps;
            })

            modalInstance.result.then(function () {
                if (angular.isDefined(promise)) {
                    $interval.cancel(promise)
                }
            }, function () {
                if (angular.isDefined(promise)) {
                    $interval.cancel(promise)
                }
            });
        })

    }
    
    var fetcher = $interval(function () {
        SnapService.listSnaps(function (snaps) {
            $scope.snaps = snaps;
        })
    }, 90000)
    
    $scope.$on('$destroy', function () {
        $interval.cancel(fetcher);
    })
    
    $scope.start = function (modInst) {
        promise = $interval(function () { 
            $scope.snapData.time--;
            if ($scope.snapData.time < 1) {
                modInst.close();
            }
        }, 1000, time)
    }

})

angular.module('RedSnap')
    .controller('snapModalController', function ($scope, $interval, $timeout, $uibModalInstance) {
    
    $timeout(function () { //hack to render DOM before controller logic. Will move into directive
        var img = new Image;
        
        var c = document.getElementById('bg-can')
        c.width = 640;
        c.height = 480;
        var ctx = c.getContext('2d');
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        }
        img.src = $scope.snapData.imgData;
        
        $scope.start($uibModalInstance);
    }, 0)
    

    
    
})