'use strict'

angular.module('RedSnap')
    .factory('Auth', function Auth($rootScope, User, Session, $cookieStore) {
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');
    
    return {
        
        login: function (userData, callback) {
            var cb = callback || angular.noop;
            Session.save({
                username: userData.username,
                password: userData.password
            },
            function (user) {
                $rootScope.curentUser = user
                return cb();
            },
            function (err) {
                console.log(err.data)
                return cb(err.data);
            })    
        },
        logout: function (callback) {
            var cb = callback || angular.noop;
            Session.delete(function (res) {
                $rootScope.curentUser = null;
                return cb();
            },
            function (err) {
                console.log(err.data);
                return cb(err.data);
            })
        },
        register: function (formData, callback) {
            var cb = callback || angular.noop;
            User.save(formData,
                function (user) {
                $rootScope.currentUser = user;
                return cb();
            },
                function (err) {
                console.log(err.data)
                return cb(err.data);
            })
        },
        currentUser: function () {
            Session.get(function (user) {
                $rootScope.currentUser = user;
            });
        },
        authenticate: function () {
            Session.get(function (user) {
                if (user) {
                    $rootScope.loggedIn = true;
                    return true;
                }
                else {
                    $rootScope.loggedIn = false;
                    return false;
                }
            });
        }
    }
})

