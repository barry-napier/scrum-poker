var request = require("supertest");
var should = require("should");
var utils = require("./utils");
var app = require("../js/app").getApp;

describe('Users', function () {

  describe('POST "/users" - ', function () {

    it('should create new user.', function (done) {
      request(app)
          .post("/api/users/")
          .set('Content-Type', 'application/json')
          .send({
            fullName: 'Barry Napier',
            playerName: 'Barry',
            email: 'barry.a.napier@gmail.com',
            password: 'password1'
          })
          .end(function (error, response) {
            response.status.should.equal(200);
            response.body.success.should.equal(true);
            response.body.code.should.equal('u10005');
            response.body.message.should.equal('User created!');
            response.body.should.have.property("userId");
            done();
          });
    });

    it('should not create user when information is missing.', function (done) {
      request(app)
          .post("/api/users/")
          .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
          .send({
            fullName: '',
            playerName: 'Barry',
            email: 'barry.a.napier@gmail.com',
            password: 'password1'
          })
          .end(function (error, response) {
            response.status.should.equal(200);
            response.body.success.should.equal(false);
            response.body.code.should.equal('u10001');
            response.body.message.should.equal('User information is incomplete.');
            done();
          });
    });

    it('should not allow creation of user with previously saved email."', function (done) {
      request(app)
          .post("/api/users/")
          .set('Content-Type', 'application/json')
          .send({
            fullName: 'Barry Napier',
            playerName: 'Barry N',
            email: 'barry.a.napier@gmail.com',
            password: 'password1'
          })
          .expect("Content-type", /json/)
          .expect(200)
          .end(function (error, response) {
            response.status.should.equal(200);
            response.body.success.should.equal(false);
            response.body.code.should.equal('u10002');
            response.body.message.should.equal('A user with that email already exists.');
            done();
          });
    });

  });

});