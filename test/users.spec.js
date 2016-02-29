process.env.NODE_ENV = 'test';

var request   = require("supertest");
var should    = require("should");
var app       = require("../js/app");
var UserModel = require('../js/models/user.model');
var config    = require('../js/config/');
var db        = require('../js/database/');
var jwt       = require('jsonwebtoken');

var secret = config.secret;

var userId;
var userToken;

describe('Users', function () {

  before(function (done) {

    var user = {

      fullName   : 'Barry Napier',
      playerName : 'Barry',
      email      : 'barry.a.napier@gmail.com',
      password   : 'password1'

    };

    UserModel.create(user, function (error, createdUser) {

      should.not.exist(error);

      createdUser.fullName.should.equal('Barry Napier');
      createdUser.playerName.should.equal('Barry');
      createdUser.email.should.equal('barry.a.napier@gmail.com');

      userId    = createdUser._id;
      userToken = jwt.sign({ email : createdUser.email, fullName : createdUser.fullName}, secret);

      done();
    });
  });

  after(function (done) {

    for (var i = 0; i < db.connection.collections.length; i++) {
      db.connection.collections[i].remove(function () {});
    }

    return done();

  });

  describe('POST "/users"', function () {

    it('should create new user.', function (done) {
      request(app)
      .post("/api/users/")
      .set('Content-Type', 'application/json')
      .send({
        fullName   : 'Joseph Bloggs',
        playerName : 'Joe',
        email      : 'joe.bloggs@gmail.com',
        password   : 'password1'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('User created!');
        response.body.should.have.property("userId");
        response.body.success.should.equal(true);

        done();

      });

    });

    it('should not create user when information is missing.', function (done) {

      request(app)
      .post("/api/users/")
      .set('Content-Type', 'application/json')
      .send({
        playerName : 'Joe',
        email : 'joe.bloggs@gmail.com',
        password : 'password1'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('User information is incomplete.');
        response.body.success.should.equal(false);

        done();

      });

    });

    it('should not allow creation of user with previously saved email."', function (done) {

      request(app)
      .post("/api/users/")
      .set('Content-Type', 'application/json')
      .send({
        fullName : 'Joseph Bloggs',
        playerName : 'Joe',
        email : 'joe.bloggs@gmail.com',
        password : 'password1'
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('A user with that email already exists.');
        response.body.success.should.equal(false);

        done();

      });

    });

    it('should not allow creation of user with invalid data."', function (done) {

      request(app)
      .post("/api/users/")
      .set('Content-Type', 'application/json')
      .send({
        fullName : 'Joseph Bloggs',
        playerName : 'Joe',
        email : 'invalid',
        password : 'password1'
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.success.should.equal(false);
        response.body.message.should.equal('An error occurred while trying to create new user.');
        response.body.should.have.property("error");

        done();

      });

    });

  });

  describe('POST "/users/authenticate"', function () {

    it('should not authenticate invalid user email.', function (done) {

      request(app)
      .post("/api/users/authenticate")
      .set('Content-Type', 'application/json')
      .send({
        email    : 'b.a.napier@gmail.com',
        password : 'password1'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('Authentication failed. User not found.');
        response.body.success.should.equal(false);

        done();
      });

    });

    it('should not authenticate invalid user password.', function (done) {

      request(app)
      .post("/api/users/authenticate")
      .set('Content-Type', 'application/json')
      .send({
        email    : 'barry.a.napier@gmail.com',
        password : 'pass'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('Authentication failed. Password incorrect.');
        response.body.success.should.equal(false);

        done();
      });

    });

    it('should authenticate user login.', function (done) {

      request(app)
      .post("/api/users/authenticate")
      .set('Content-Type', 'application/json')
      .send({
        email    : 'barry.a.napier@gmail.com',
        password : 'password1'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('Authenticated!');
        response.body.should.have.property("userId");
        response.body.should.have.property("token");
        response.body.success.should.equal(true);

        done();
      });

    });

  });

  describe('GET "/users/:id"', function () {

    it('should get user information.', function (done) {

      var url = "/api/users/" + userId;

      request(app)
      .get(url)
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('User retrieved!');
        response.body.should.have.property("user");
        response.body.success.should.equal(true);

        done();
      });

    });

    it('should not get user information.', function (done) {

      var url = "/api/users/" + "invalid";

      request(app)
      .get(url)
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('User to retrieve not found.');
        response.body.success.should.equal(false);

        done();
      });

    });

    it('should not get user information.', function (done) {

      var url = "/api/users/" + "invalid";

      request(app)
      .get(url)
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('User to retrieve not found.');
        response.body.success.should.equal(false);

        done();
      });

    });

  });

  describe('PUT "/users/:id"', function () {

    it('should update user information.', function (done) {

      var url = "/api/users/" + userId;

      request(app)
      .put(url)
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .send({
        fullName   : 'Joseph Bloggs',
        playerName : 'Joe',
        password   : 'password1'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('User updated!');
        response.body.success.should.equal(true);

        done();
      });

    });

    it('should not update user with invalid information.', function (done) {

      var url = "/api/users/" + 'test';

      request(app)
      .put(url)
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .send({
        fullName   : 'Joseph Bloggs',
        playerName : 'Joe',
        password   : 'password1'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('User to update not found.');
        response.body.success.should.equal(false);

        done();
      });

    });

    it('should update user information.', function (done) {

      var url = "/api/users/" + userId;

      request(app)
      .put(url)
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .send({
        fullName   : 'Joseph Bloggs',
        playerName : 'Joe',
        password   : '123'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('An error occurred while trying to save the updated user.');
        response.body.success.should.equal(false);
        response.body.should.have.property("error");

        done();

      });

    });

  });

  describe('DELETE "/users/:id"', function () {

    it('should delete existing user.', function (done) {

      var url = "/api/users/" + userId;

      request(app)
      .delete(url)
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('User successfully deleted!');
        response.body.success.should.equal(true);

        done();
      });

    });

    it('should not delete existing user.', function (done) {

      var url = "/api/users/" + "invalid";

      request(app)
      .delete(url)
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('An error occurred while trying to delete a user.');
        response.body.success.should.equal(false);
        response.body.should.have.property("error");

        done();
      });

    });

  });

});