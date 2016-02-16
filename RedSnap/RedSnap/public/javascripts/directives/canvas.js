angular.module('RedSnap')
.directive('snapcanvas', function () {
    return {
        templateUrl: 'views/cam/snapcanvas.html',
        replace: true,
        restrict: 'AE',
        scope: {
            config: '=conf'
        },
        link: function postLink($scope, elm) {

            var conf = $scope.$parent.conf;
            var c = document.createElement('canvas');
            var att = document.createAttribute("id");
            att.value = 'snapcan';
            c.setAttributeNode(att);

            c.width = conf.width;
            c.height = conf.height;

            var ctx = c.getContext('2d')
            ctx.putImageData(conf.imageData, 0, 0)
            
            angular.element(c).css("width", "100%")

            elm.find('div').append(c);

        }

    }
})