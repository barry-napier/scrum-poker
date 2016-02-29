process.env.NODE_ENV = 'test';

var request   = require("supertest");
var should    = require("should");
var app       = require("../js/app");
var UserModel = require('../js/models/user.model');
var GameModel = require('../js/models/game.model');
var config    = require('../js/config/');
var db        = require('../js/database/');
var jwt       = require('jsonwebtoken');
var mongoose  = require('mongoose');

var secret = config.secret;

var userId;
var userToken;

describe('Games', function () {

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

      var game1 = {
        name        : 'Game 1',
        description : 'This is game 1.',
        creator     : userId
      };

      var game2 = {
        name : 'Game 2',
        description : 'This is game 2.',
        creator     : userId

      };

      var game3 = {
        name : 'Game 3',
        description : 'This is game 3.',
        creator     : userId
      };

      GameModel.create(game1, function (error, createdUser) {});
      GameModel.create(game2, function (error, createdUser) {});
      GameModel.create(game3, function (error, createdUser) {});

      done();

    });

  });

  after(function (done) {

    for (var i in db.connection.collections) {
      db.connection.collections[i].remove(function() {});
    }
    return done();

  });

  describe('GET "/users/:userId/games"', function () {

    it('should get all games for user.', function (done) {

      request(app)
      .get("/api/users/"+ userId + "/games")
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('Games retrieved!');
        response.body.should.have.property("games");
        response.body.success.should.equal(true);
        response.body.games.length.should.equal(3);

        done();

      });

    });

    it('should not get all games for invalid user.', function (done) {

      request(app)
      .get("/api/users/"+ "invalid" + "/games")
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('An error occurred while trying to retrieve games.');
        response.body.success.should.equal(false);

        done();

      });

    });

  });

  describe('POST "/users/:userId/games"', function () {

    it('should create new game for user.', function (done) {

      request(app)
      .post("/api/users/"+ userId + "/games")
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .send({
        name        : 'Game 4',
        description : 'This is game 4.'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('Game created!');
        response.body.success.should.equal(true);

        done();

      });

    });

    it('should not create new game with name.', function (done) {

      request(app)
      .post("/api/users/"+ userId + "/games")
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .send({
        description : 'This is game 4.'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('Game information is incomplete.');
        response.body.success.should.equal(false);

        done();

      });

    });

    it('should not create new game with name.', function (done) {

      request(app)
      .post("/api/users/"+ userId + "/games")
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .send({
        name : '12',
        description : '123'
      })
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('An error occurred while trying to create new game.');
        response.body.success.should.equal(false);
        response.body.should.have.property("error");

        done();

      });

    });

  });

});