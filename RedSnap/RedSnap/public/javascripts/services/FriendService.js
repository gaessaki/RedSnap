'use strict'

angular.module('RedSnap')
    .factory('FriendService', function FriendService(Friend) {
    
    return {
        addFriend: function (friendName, callback) {
            var cb = callback || angular.noop;
            Friend.save({
                friend: friendName
            }, function () {
                Friend.get(function (friends) {
                    return cb(null, friends);
                })
            },
            function (err) {
                console.log(err.data);
                Friend.get(function (friends) {
                    return cb(err.data, friends);
                })
                return cb(err.data, null);
            })
        },
        removeFriend: function (friendName, callback) {
            var cb = callback || angular.noop;
            Friend.remove({
                friend: friendName
            }, function () { 
                Friend.get(function (friends) {
                    return cb(null, friends);
                })
            }),
            function (err) {
                console.log(err.data);
                Friend.get(function (friends) {
                    return cb(err.data, friends);
                })
                return cb(err.data, null);
            }
        },
        listFriends: function (callback) {
            var cb = callback || angular.noop;
            Friend.get(function (friends) {
                return cb(friends);
            })
        }
    }
})