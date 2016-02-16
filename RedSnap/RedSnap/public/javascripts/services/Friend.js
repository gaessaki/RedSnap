'use strict';

angular.module('RedSnap')
  .factory('Friend', function ($resource) {
    return $resource('/api/friends/');
});