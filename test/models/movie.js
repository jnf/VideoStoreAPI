var assert = require('assert'),
    Movie  = require('../../models/movie'),
    sqlite3 = require('sqlite3').verbose();



describe("Movie", function() {
  var movie, db_cleaner

  beforeEach(function(done) {
    movie = new Movie();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory) \
        VALUES('Jaws', 'Shark!', 'Yesterday', 10); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
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

    it("can save changes to a movie", function(done) {
      movie.find("Jaws", function(err, res) {
        var original_title = res[0].title;
        var id = res[0].id;

        movie.save({title: "Jaws 2: Jawsier", id: id}, function(err, res) {
          assert.equal(err, undefined);
          assert.equal(res.inserted_id, 0); //it didn't insert any records
          assert.equal(res.changed, 1); //it updated one record
          done();
        })
      })
    });

    it("can save a new movie to the database", function(done) {
      var data = {
        title: "RoboJaws",
        overview: "Jaws is hunted by RoboJaws",
        release_date: "Tomorrow",
        inventory: 10
      }

      movie.create(data, function(err, res) {
        assert.equal(res.inserted_id, 2); //it inserted a new record
        assert.equal(res.changed, 1); //one record was changed

        movie.find("RoboJaws", function(err, res) {
          assert.equal(res.length, 1);
          assert.equal(res[0].title, 'RoboJaws'); //we found our new movie
          done();
        })
      })
    });
  })
})

