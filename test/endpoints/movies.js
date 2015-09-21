var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("Endpoints under /movies", function() {
  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory) \
        VALUES('Jaws', 'Shark!', 'Yesterday', 10), \
              ('Maws', 'Worm!', 'Yesterday', 11); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  })

  describe("GET /", function() {
    var movie_request;
    
    beforeEach(function(done) {
      movie_request = agent.get('/movies').set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns an array of movie objects", function(done) {
      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.length, 2); //the db_cleaner inserted two records

        var keys = ['id', 'title', 'overview', 'release_date', 'inventory'];
        assert.deepEqual(Object.keys(result.body[0]), keys);
        done();
      })
    })
  })

  describe("GET /movies/:title", function() {
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent.get('/movies/Jaws').set('Accept', 'application/json');
      done();
    })

    it("can find jaws", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 1);

          var keys = ['id', 'title', 'overview', 'release_date', 'inventory'];
          assert.deepEqual(Object.keys(result.body[0]), keys);

          assert.equal(result.body[0].title, 'Jaws');
          done();
        });
    })
  })
})
