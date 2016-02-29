process.env.NODE_ENV = 'test';

var request   = require("supertest");
var should    = require("should");
var app       = require("../js/app");

describe('Authorisation', function () {

  before(function (done) {

    done();

  });

  after(function (done) {

    done();

  });

  describe('GET "/users/:id"', function () {

    it('should not authenticate user with no token.', function (done) {

      request(app)
      .get("/api/users/id")
      .expect('Content-Type', 'application/json')
      .end(function (error, response) {

        response.status.should.equal(403);
        response.body.message.should.equal('No token provided.');
        response.body.success.should.equal(false);

        done();

      });

    });

    it('should not authenticate user with incorrect token.', function (done) {

      request(app)
      .get("/api/users/id")
      .expect('Content-Type', 'application/json')
      .set('x-access-token', 'invalid-token')
      .end(function (error, response) {

        response.status.should.equal(403);
        response.body.message.should.equal('Failed to authenticate token.');
        response.body.success.should.equal(false);

        done();

      });

    });

  });

});