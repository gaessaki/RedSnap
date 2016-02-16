'use strict';

angular.module('RedSnap')
  .factory('SnapView', function ($resource) {
    return $resource('/api/snaps/view');
});