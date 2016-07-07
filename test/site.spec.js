process.env.NODE_ENV = 'test';

var request   = require("supertest");
var should    = require("should");
var app       = require("../server/app");

describe('Site', function () {

  before(function (done) {

    done();

  });

  after(function (done) {

    done();

  });

  describe('GET "/"', function () {

    it('should retrieve site html.', function (done) {

      request(app)
      .get("/")
      .expect('Content-Type', /html/)
      .end(function (error, response) {

        response.status.should.equal(200);
        response.should.have.property("text");
        response.text.should.startWith('<!doctype html>');

        done();

      });

    });

  });

  describe('GET "/*"', function () {

    it('should retrieve route not found.', function (done) {

      request(app)
      .get("/api")
      .expect('Content-Type', 'application/json')
      .end(function (error, response) {

        response.status.should.equal(200);
        response.body.message.should.equal('Route not defined.');
        response.body.success.should.equal(false);

        done();

      });

    });

  });

});