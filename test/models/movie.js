var assert = require('assert'),
    Movie  = require('../../models/movie'),
    sqlite3 = require('sqlite3').verbose();


describe("Movie", function() {
  var movie;

  beforeEach(function() {
    movie = new Movie();
  })

  it("can be instantiated", function() {
    assert(movie instanceof Movie);
  })

  it("has a database connection", function() {
    assert.notEqual(movie.db, undefined);
    assert(movie.db instanceof sqlite3.Database);
  })

  describe("instance methods", function() {
    it("can find a movie by title", function(done) {
      movie.find("Jaws", function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);
        assert.equal(res[0].title, 'Jaws');
        done();
      })
    })
  })
})

