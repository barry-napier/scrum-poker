angular.module('scrumPoker')

    .factory('UserService', [

      '$http',
      '$httpParamSerializer',

      function ($http, $httpParamSerializer) {

        var URL = '/api/users/';

        // create a new object
        var userFactory = {};

        // get a single user
        userFactory.get = function (id) {
          return $http.get('/api/users/' + id);
        };

        // get all users
        userFactory.all = function () {
          return $http.get('/api/users/');
        };

        // create a user
        userFactory.create = function (userData) {

          var config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          };

          return $http.post(URL, $httpParamSerializer(userData), config);

        };

        // update a user
        userFactory.update = function (id, userData) {
          return $http.put('/api/users/' + id, userData);
        };

        // delete a user
        userFactory.delete = function (id) {
          return $http.delete('/api/users/' + id);
        };

        // return our entire userFactory object
        return userFactory;

      }]
    );
