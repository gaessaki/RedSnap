angular.module('RedSnap')

    .controller('camViewController', function ($scope, $state) {
    
    var _video = null;
    $scope.channel = {
        videoWidth: 640,
        videoHeight: 480
    };
    
    $scope.webcamError = false;
    $scope.onError = function (err) {
        $scope.$apply(function () {
            $scope.webcamError = err;
        })
    };
    $scope.onStream = function (stream) {
        _video = $scope.channel.video;
    };
    $scope.onSuccess = function () { };

    $scope.snap = function () {
        if (_video) {
            var idata = getVideoData(0, 0, _video.width, _video.height);
            $scope.$parent.snapImage = idata
            $scope.$parent.snapWidth = _video.width;
            $scope.$parent.snapHeight = _video.height;
            $state.go('cam.draw')
        }
    }

    var getVideoData = function getVideoData(x, y, w, h) {
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        var ctx = c.getContext('2d');
        ctx.drawImage(_video, 0, 0);
        return ctx.getImageData(x, y, w, h);
    }
})