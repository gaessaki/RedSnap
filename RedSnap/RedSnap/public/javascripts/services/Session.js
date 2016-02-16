'use strict';

angular.module('RedSnap')
  .factory('Session', function ($resource) {
    return $resource('/auth/session/');
});