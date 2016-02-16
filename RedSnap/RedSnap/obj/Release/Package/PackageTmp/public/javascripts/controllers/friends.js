angular.module('RedSnap')

    .controller('friendsController', function ($scope, $timeout, FriendService) {
    $scope.friends = {}
    $scope.potentialfriend = ""
    FriendService.listFriends(function (friends) {
        $scope.friends = friends;
    })

    $scope.befriend = function (friend) {
        $scope.potentialfriend = ""
        FriendService.addFriend(friend, function (err, friends) {
            if (err) {
                $scope.msg = err;
            }
            if (friends) {
                $scope.msg = "Friend request sent and/or friend added"
                $scope.friends = friends;
                $timeout(function () {
                    $scope.msg = "";
                }, 3500)
            }
        })

    }
    $scope.unfriend = function (friend) {
        FriendService.removeFriend(friend, function (err, friends) {
            if (err) console.log(err)
            if (friends) $scope.friends = friends;
        })
    }
})