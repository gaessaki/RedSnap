'use strict';

angular.module('RedSnap')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:id/', {},
      {
        'update': {
            method: 'PUT'
        }
    });
});