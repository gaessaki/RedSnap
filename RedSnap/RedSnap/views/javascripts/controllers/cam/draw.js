angular.module('RedSnap')

    .controller('camDrawController', function ($scope, $state, FriendService, SnapService) {
    
    $scope.friends = {}
    $scope.sendFriends = []
    $scope.data = {
        availableOptions: [
            { value: '1', name: '1' },
            { value: '2', name: '2' },
            { value: '3', name: '3' },
            { value: '4', name: '4' },
            { value: '5', name: '5' },
            { value: '6', name: '6' },
            { value: '7', name: '7' },
            { value: '8', name: '8' },
            { value: '9', name: '9' },
            { value: '10', name: '10' }
        ],
        selectedOption: { value: '5', name: '5' } //This sets the default value of the select in the ui
    };
    
    
    FriendService.listFriends(function (friends) {
        $scope.friends = friends;
    })
    
    $scope.conf = {
        width: $scope.$parent.snapWidth,
        height: $scope.$parent.snapHeight,
        imageData: $scope.$parent.snapImage
    }
    $scope.checked = function (username, checkedval) {
        if (checkedval) {
            $scope.sendFriends.push(username)
        }
        else {
            if ($scope.sendFriends.indexOf(username) !== -1)
                $scope.sendFriends.splice($scope.sendFriends.indexOf(username), 1)
        }
    }
    
    $scope.sendSnap = function () {
        
        $scope.loading = true;
        
        var c = document.getElementById('snapcan')
        var dataURL = c.toDataURL();
        //get friends
        //get message
        //get time
        
        sendSnapObj = {
            img: dataURL,
            friends: $scope.sendFriends,
            time: $scope.data.selectedOption.value,
            text: $scope.loveMessage
        }
        
        SnapService.sendSnap(sendSnapObj, function (err) {
            if (!err) {
                $scope.loading = false;
                $state.go('main')
            }
            $scope.errors = err;
        })
    }

})