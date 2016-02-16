'use strict';

angular.module('RedSnap')
  .factory('Snap', function ($resource) {
    return $resource('/api/snaps/');
});