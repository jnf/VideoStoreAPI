var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("Endpoints under /movies", function() {
  describe("GET /", function() {
    var movie_request;
    
    beforeEach(function(done) {
      movie_request = request(app).get('/movies').set('Accept', 'application/json');

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
})
