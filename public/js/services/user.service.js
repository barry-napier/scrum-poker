angular.module('scrumPoker')

  .factory('UserService', [

    '$http',

    function ($http) {

      var URL = '/api/users/';

      // create a new object
      var userFactory = {};

      // get a single user
      userFactory.get = function (id) {
        return $http.get(URL + id);
      };

      // get all users
      userFactory.all = function () {
        return $http.get(URL);
      };

      // create a user
      userFactory.create = function (userData) {

        var data = JSON.stringify(userData);

        console.log(data);

        var req = {
          method: 'POST',
          url: URL,
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        }

        return $http(req);

      };

      // update a user
      userFactory.update = function (id, userData) {
        return $http.put(URL + id, userData);
      };

      // delete a user
      userFactory.delete = function (id) {
        return $http.delete(URL + id);
      };

      // login a user
      userFactory.login = function (userData) {
        return $http.post(URL + 'authenticate', userData);
      };

      // return our entire userFactory object
      return userFactory;

    }]
  );
