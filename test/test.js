// Generated by CoffeeScript 1.12.5
(function() {
  var RedisSessions, _, async, should;

  _ = require("lodash");

  should = require("should");

  async = require("async");

  RedisSessions = require("../index");

  describe('Redis-Sessions Test', function() {
    var app1, app2, bulksessions, rs, token1, token2, token3, token4;
    rs = null;
    app1 = "test";
    app2 = "TEST";
    token1 = null;
    token2 = null;
    token3 = null;
    token4 = null;
    bulksessions = [];
    before(function(done) {
      done();
    });
    after(function(done) {
      done();
    });
    it('get a RedisSessions instance', function(done) {
      rs = new RedisSessions();
      rs.should.be.an.instanceOf(RedisSessions);
      done();
    });
    it('Remove all sessions from app1', function(done) {
      rs.killall({
        app: app1
      }, function(err, resp) {
        should.exist(resp.kill);
        done();
      });
    });
    it('Remove all sessions from app2', function(done) {
      rs.killall({
        app: app2
      }, function(err, resp) {
        should.exist(resp.kill);
        done();
      });
    });
    describe('GET: Part 1', function() {
      it('Ping the redis server', function(done) {
        rs.ping(function(err, resp) {
          resp.should.equal("PONG");
          done();
        });
      });
      it('Get a Session with invalid app format: no app supplied', function(done) {
        rs.get({}, function(err, resp) {
          err.message.should.equal("No app supplied");
          done();
        });
      });
      it('Get a Session with invalid app format: too short', function(done) {
        rs.get({
          app: "a"
        }, function(err, resp) {
          err.message.should.equal("Invalid app format");
          done();
        });
      });
      it('Get a Session with invalid token format: no token at all', function(done) {
        rs.get({
          app: app1
        }, function(err, resp) {
          err.message.should.equal("No token supplied");
          done();
        });
      });
      it('Get a Session with invalid token format: token shorter than 64 chars', function(done) {
        rs.get({
          app: app1,
          token: "lsdkjfslkfjsldfkj"
        }, function(err, resp) {
          err.message.should.equal("Invalid token format");
          done();
        });
      });
      it('Get a Session with invalid token format: token longer than 64 chars', function(done) {
        rs.get({
          app: app1,
          token: "0123456789012345678901234567890123456789012345678901234567890123456789"
        }, function(err, resp) {
          err.message.should.equal("Invalid token format");
          done();
        });
      });
      it('Get a Session with invalid token format: token with invalid character', function(done) {
        rs.get({
          app: app1,
          token: "!123456789012345678901234567890123456789012345678901234567891234"
        }, function(err, resp) {
          err.message.should.equal("Invalid token format");
          done();
        });
      });
      it('Get a Session with valid token format but token should not exist', function(done) {
        rs.get({
          app: app1,
          token: "0123456789012345678901234567890123456789012345678901234567891234"
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.not.have.keys('id');
          done();
        });
      });
    });
    describe('CREATE: Part 1', function() {
      it('Create a session with invalid data: no app supplied', function(done) {
        rs.create({}, function(err, resp) {
          err.message.should.equal("No app supplied");
          done();
        });
      });
      it('Create a session with invalid data: no id supplied', function(done) {
        rs.create({
          app: app1
        }, function(err, resp) {
          err.message.should.equal("No id supplied");
          done();
        });
      });
      it('Create a session with invalid data: no ip supplied', function(done) {
        rs.create({
          app: app1,
          id: "user1"
        }, function(err, resp) {
          err.message.should.equal("No ip supplied");
          done();
        });
      });
      it('Create a session with invalid data: Longer than 39 chars ip supplied', function(done) {
        rs.create({
          app: app1,
          id: "user1",
          ip: "1234567890123456789012345678901234567890"
        }, function(err, resp) {
          err.message.should.equal("Invalid ip format");
          done();
        });
      });
      it('Create a session with invalid data: zero length ip supplied', function(done) {
        rs.create({
          app: app1,
          id: "user1",
          ip: ""
        }, function(err, resp) {
          err.message.should.equal("No ip supplied");
          done();
        });
      });
      it('Create a session with invalid data: ttl too short', function(done) {
        rs.create({
          app: app1,
          id: "user1",
          ip: "127.0.0.1",
          ttl: 4
        }, function(err, resp) {
          err.message.should.equal("ttl must be a positive integer >= 10");
          done();
        });
      });
      it('Create a session with valid data: should return a token', function(done) {
        rs.create({
          app: app1,
          id: "user1",
          ip: "127.0.0.1",
          ttl: 30
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('token');
          token1 = resp.token;
          done();
        });
      });
      it('Activity should show 1 user', function(done) {
        rs.activity({
          app: app1,
          dt: 60
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('activity');
          resp.activity.should.equal(1);
          done();
        });
      });
      it('Create another session for user1: should return a token', function(done) {
        rs.create({
          app: app1,
          id: "user1",
          ip: "127.0.0.2",
          ttl: 30
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('token');
          done();
        });
      });
      it('Create yet another session for user1 with a `d` object: should return a token', function(done) {
        rs.create({
          app: app1,
          id: "user1",
          ip: "127.0.0.2",
          ttl: 30,
          d: {
            "foo": "bar",
            "nu": null,
            "hi": 123,
            "lo": -123,
            "boo": true,
            "boo2": false
          }
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('token');
          token4 = resp.token;
          done();
        });
      });
      it('Create yet another session for user1 with an invalid `d` object: should return a token', function(done) {
        rs.create({
          app: app1,
          id: "user1",
          ip: "2001:0000:1234:0000:0000:C1C0:ABCD:0876",
          ttl: 30,
          d: {
            "inv": []
          }
        }, function(err, resp) {
          should.not.exist(resp);
          should.exist(err);
          done();
        });
      });
      it('Create yet another session for user1 with an invalid `d` object: should return a token', function(done) {
        rs.create({
          app: app1,
          id: "user1",
          ip: "2001:0000:1234:0000:0000:C1C0:ABCD:0876",
          ttl: 30,
          d: {}
        }, function(err, resp) {
          should.not.exist(resp);
          should.exist(err);
          done();
        });
      });
      it('Activity should STILL show 1 user', function(done) {
        rs.activity({
          app: app1,
          dt: 60
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('activity');
          resp.activity.should.equal(1);
          done();
        });
      });
      it('Create another session with valid data: should return a token', function(done) {
        rs.create({
          app: app1,
          id: "user2",
          ip: "127.0.0.1",
          ttl: 10
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('token');
          token2 = resp.token;
          done();
        });
      });
      it('Activity should show 2 users', function(done) {
        rs.activity({
          app: app1,
          dt: 60
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('activity');
          resp.activity.should.equal(2);
          done();
        });
      });
      it('Sessions of App should return 4 users', function(done) {
        rs.soapp({
          app: app1,
          dt: 60
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('sessions');
          resp.sessions.length.should.equal(4);
          done();
        });
      });
      it('Create a session for another app with valid data: should return a token', function(done) {
        rs.create({
          app: app2,
          id: "user1",
          ip: "127.0.0.1",
          ttl: 30
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('token');
          token3 = resp.token;
          done();
        });
      });
      it('Activity should show 1 user', function(done) {
        rs.activity({
          app: app2,
          dt: 60
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('activity');
          resp.activity.should.equal(1);
          done();
        });
      });
      it('Create 1000 sessions for app2: succeed', function(done) {
        var i, j, pq;
        pq = [];
        for (i = j = 0; j < 1000; i = ++j) {
          pq.push({
            app: app2,
            id: "bulkuser_" + i,
            ip: "127.0.0.1"
          });
        }
        async.map(pq, rs.create, function(err, resp) {
          var e, k, len;
          for (k = 0, len = resp.length; k < len; k++) {
            e = resp[k];
            e.should.have.keys('token');
            bulksessions.push(e.token);
            e.token.length.should.equal(64);
          }
          done();
        });
      });
      it('Activity should show 1001 user', function(done) {
        rs.activity({
          app: app2,
          dt: 60
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('activity');
          resp.activity.should.equal(1001);
          done();
        });
      });
      it('Get 1000 sessions for app2: succeed', function(done) {
        var e, i, j, len, pq;
        pq = [];
        for (i = j = 0, len = bulksessions.length; j < len; i = ++j) {
          e = bulksessions[i];
          pq.push({
            app: app2,
            token: e
          });
        }
        async.map(pq, rs.get, function(err, resp) {
          var k, len1;
          resp.length.should.equal(1000);
          for (i = k = 0, len1 = resp.length; k < len1; i = ++k) {
            e = resp[i];
            e.should.have.keys('id', 'r', 'w', 'ttl', 'idle', 'ip');
            e.id.should.equal("bulkuser_" + i);
          }
          done();
        });
      });
      it('Create a session for bulkuser_999 with valid data: should return a token', function(done) {
        rs.create({
          app: app2,
          id: "bulkuser_999",
          ip: "127.0.0.2",
          ttl: 30
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('token');
          done();
        });
      });
      it('Check if we have 2 sessions for bulkuser_999', function(done) {
        rs.soid({
          app: app2,
          id: "bulkuser_999"
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('sessions');
          resp.sessions.length.should.equal(2);
          resp.sessions[0].id.should.equal("bulkuser_999");
          done();
        });
      });
      it('Remove those 2 sessions for bulkuser_999', function(done) {
        rs.killsoid({
          app: app2,
          id: "bulkuser_999"
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('kill');
          resp.kill.should.equal(2);
          done();
        });
      });
      it('Check if we have still have sessions for bulkuser_999: should return 0', function(done) {
        rs.soid({
          app: app2,
          id: "bulkuser_999"
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('sessions');
          resp.sessions.length.should.equal(0);
          done();
        });
      });
    });
    describe('GET: Part 2', function() {
      it('Get the Session for token1: should work', function(done) {
        rs.get({
          app: app1,
          token: token1
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.have.keys('id', 'r', 'w', 'ttl', 'idle', 'ip');
          resp.id.should.equal("user1");
          resp.ttl.should.equal(30);
          done();
        });
      });
      it('Get the Session for token1 again: should work', function(done) {
        rs.get({
          app: app1,
          token: token1
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.have.keys('id', 'r', 'w', 'ttl', 'idle', 'ip');
          resp.id.should.equal("user1");
          resp.ttl.should.equal(30);
          resp.r.should.equal(2);
          done();
        });
      });
      it('Sessions of App should return 4 users', function(done) {
        rs.soapp({
          app: app1,
          dt: 60
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('sessions');
          resp.sessions.length.should.equal(4);
          done();
        });
      });
      it('Kill the Session for token1: should work', function(done) {
        rs.kill({
          app: app1,
          token: token1
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.have.keys('kill');
          resp.kill.should.equal(1);
          done();
        });
      });
      it('Get the Session for token1: should fail', function(done) {
        rs.get({
          app: app1,
          token: token1
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.not.have.keys('id');
          done();
        });
      });
      it('Activity for app1 should show 2 users still', function(done) {
        rs.activity({
          app: app1,
          dt: 60
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.should.have.keys('activity');
          resp.activity.should.equal(2);
          done();
        });
      });
      it('Get the Session for token2', function(done) {
        rs.get({
          app: app1,
          token: token2
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.have.keys('id', 'r', 'w', 'ttl', 'idle', 'ip');
          resp.id.should.equal("user2");
          resp.ttl.should.equal(10);
          done();
        });
      });
      it('Get the Session for token4', function(done) {
        rs.get({
          app: app1,
          token: token4
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.have.keys('id', 'r', 'w', 'ttl', 'idle', 'ip', 'd');
          resp.id.should.equal("user1");
          resp.ttl.should.equal(30);
          resp.d.foo.should.equal("bar");
          done();
        });
      });
    });
    describe('SET', function() {
      it('Set some params for token1 with no d: should fail', function(done) {
        rs.set({
          app: app1,
          token: token1
        }, function(err, resp) {
          err.message.should.equal("No d supplied");
          done();
        });
      });
      it('Set some params for token1 with d being an array', function(done) {
        rs.set({
          app: app1,
          token: token1,
          d: [12, "bla"]
        }, function(err, resp) {
          err.message.should.equal("d must be an object");
          done();
        });
      });
      it('Set some params for token1 with d being a string: should fail', function(done) {
        rs.set({
          app: app1,
          token: token1,
          d: "someString"
        }, function(err, resp) {
          err.message.should.equal("d must be an object");
          done();
        });
      });
      it('Set some params for token1 with forbidden type (array): should fail', function(done) {
        rs.set({
          app: app1,
          token: token1,
          d: {
            arr: [1, 2, 3]
          }
        }, function(err, resp) {
          err.message.should.equal("d.arr has a forbidden type. Only strings, numbers, boolean and null are allowed.");
          done();
        });
      });
      it('Set some params for token1 with forbidden type (object): should fail', function(done) {
        rs.set({
          app: app1,
          token: token1,
          d: {
            obj: {
              bla: 1
            }
          }
        }, function(err, resp) {
          err.message.should.equal("d.obj has a forbidden type. Only strings, numbers, boolean and null are allowed.");
          done();
        });
      });
      it('Set some params for token1 with an empty object: should fail', function(done) {
        rs.set({
          app: app1,
          token: token1,
          d: {}
        }, function(err, resp) {
          err.message.should.equal("d must containt at least one key.");
          done();
        });
      });
      it('Set some params for token1: should fail as token1 was killed', function(done) {
        rs.set({
          app: app1,
          token: token1,
          d: {
            str: "haha"
          }
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.not.have.keys('id');
          done();
        });
      });
      it('Set some params for token2: should work', function(done) {
        rs.set({
          app: app1,
          token: token2,
          d: {
            hi: "ho",
            count: 120,
            premium: true,
            nix: null
          }
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          done();
        });
      });
      it('Get the session for token2: should work and contain new values', function(done) {
        rs.get({
          app: app1,
          token: token2
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.d.should.have.keys('hi', 'count', 'premium');
          done();
        });
      });
      it('Can access session with user id', function(done) {
        rs.getsoid({
          app: app1,
          id: "user2"
        }, function(err, resp) {
          should.not.exist(err);
          should.exist(resp);
          resp.d.should.have.keys('hi', 'count', 'premium');
          done();
        });
      });
      it('Remove a param from token2: should work', function(done) {
        rs.set({
          app: app1,
          token: token2,
          d: {
            hi: null
          }
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.d.should.have.keys('count', 'premium');
          done();
        });
      });
      it('Get the session for token2: should work and contain modified values', function(done) {
        rs.get({
          app: app1,
          token: token2
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.d.should.have.keys('count', 'premium');
          done();
        });
      });
      it('Remove all remaining params from token2: should work', function(done) {
        rs.set({
          app: app1,
          token: token2,
          d: {
            count: null,
            premium: null
          }
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.not.have.keys('d');
          done();
        });
      });
      it('Get the session for token2: should work and not contain the d key', function(done) {
        rs.get({
          app: app1,
          token: token2
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.not.have.keys('d');
          done();
        });
      });
      it('Remove all remaining params from token2 again: should work', function(done) {
        rs.set({
          app: app1,
          token: token2,
          d: {
            count: null,
            premium: null
          }
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.not.have.keys('d');
          done();
        });
      });
      it('Get the session for token2: should work and not contain the d key', function(done) {
        rs.get({
          app: app1,
          token: token2
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.should.not.have.keys('d');
          done();
        });
      });
      it('Set some params for token2: should work', function(done) {
        rs.set({
          app: app1,
          token: token2,
          d: {
            a: "sometext",
            b: 20,
            c: true,
            d: false
          }
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.d.should.have.keys('a', 'b', 'c', 'd');
          resp.d.a.should.equal("sometext");
          resp.d.b.should.equal(20);
          resp.d.c.should.equal(true);
          resp.d.d.should.equal(false);
          done();
        });
      });
      it('Modify some params for token2: should work', function(done) {
        rs.set({
          app: app1,
          token: token2,
          d: {
            a: false,
            b: "some_text",
            c: 20,
            d: true,
            e: 20.212
          }
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.d.should.have.keys('a', 'b', 'c', 'd', 'e');
          resp.d.a.should.equal(false);
          resp.d.b.should.equal('some_text');
          resp.d.c.should.equal(20);
          resp.d.d.should.equal(true);
          resp.d.e.should.equal(20.212);
          done();
        });
      });
      it('Get the params for token2: should work', function(done) {
        rs.get({
          app: app1,
          token: token2
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.be.an.Object;
          resp.d.should.have.keys('a', 'b', 'c', 'd', 'e');
          resp.d.a.should.equal(false);
          resp.d.b.should.equal('some_text');
          resp.d.c.should.equal(20);
          resp.d.d.should.equal(true);
          resp.d.e.should.equal(20.212);
          done();
        });
      });
    });
    describe('CLEANUP', function() {
      it('Remove all sessions from app1', function(done) {
        rs.killall({
          app: app1
        }, function(err, resp) {
          should.exist(resp.kill);
          done();
        });
      });
      it('Remove all sessions from app2', function(done) {
        rs.killall({
          app: app2
        }, function(err, resp) {
          should.exist(resp.kill);
          done();
        });
      });
      it('Issue the Quit Command.', function(done) {
        rs.quit();
        done();
      });
    });
  });

}).call(this);
