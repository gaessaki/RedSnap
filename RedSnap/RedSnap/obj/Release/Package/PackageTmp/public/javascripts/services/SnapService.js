'use strict'

angular.module('RedSnap')
    .factory('SnapService', function SnapService(Snap, SnapView) {
    
    return {
        sendSnap: function (snapData, callback) {
            var cb = callback || angular.noop;
            Snap.save({
                snap: snapData
            },
            function (err) {
                console.log(err.data);
                return cb(err.data);
            })
        },
        viewSnap: function (snapData, callback) {
            var cb = callback || angular.noop;
            SnapView.save({
                snapInfo: snapData
            }, function (snap) {
                return cb(snap);
            })
        },
        listSnaps: function (callback) {
            var cb = callback || angular.noop;
            Snap.query(function (snaps) {
                return cb(snaps);
            })
        }
    }
})