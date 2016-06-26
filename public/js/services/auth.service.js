angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken, $window) {

  var authFactory = {};

  authFactory.login = function(email, password) {

    return $http.post('/api/users/authenticate', {

      email    : email,
      password : password

    })
    .success(function(data) {

      AuthToken.setToken(data.token);
      return data;

    });

  };

  authFactory.logout = function() {

    AuthToken.setToken();
    $window.location.href = '/';

  };

  authFactory.isLoggedIn = function() {

    if (AuthToken.getToken()) {

      return true;

    } else {

      return false;

    }

  };

  authFactory.getUser = function() {

    if (AuthToken.getToken()) {

      return $http.get('/api/me', {cache : true});

    } else {

      return $q.reject({message : 'User has no token.'});

    }

  };

  return authFactory;

})

.factory('AuthToken', function($window) {

  var authTokenFactory = {};

  authTokenFactory.getToken = function() {

    return $window.localStorage.getItem('token');

  };

  authTokenFactory.setToken = function(token) {

    if (token) {

      $window.localStorage.setItem('token', token);

    } else {

      $window.localStorage.removeItem('token');

    }

  };

  return authTokenFactory;

})

.factory('AuthInterceptor', function($q, $location, AuthToken) {

  var interceptorFactory = {};

  interceptorFactory.request = function(config) {

    var token = AuthToken.getToken();


    if (token) {

      config.headers['x-access-token'] = token;

    }

    return config;

  };

  interceptorFactory.responseError = function(response) {

    if (response.status == 403) {

      AuthToken.setToken();
      $location.path('/login');

    }

    return $q.reject(response);

  };

  return interceptorFactory;

});