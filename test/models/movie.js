var assert = require('assert'),
    Movie  = require('../../models/movie'),
    seeder  = require('../../utils/seeds/movies'),
    sqlite3 = require('sqlite3').verbose();

describe("Movie", function() {
  var movie, db_cleaner

  beforeEach(function(done) {
    seeder(done);
    movie = new Movie();
  })

  it("can be instantiated", function() {
    assert(movie instanceof Movie);
  })

  describe("instance methods", function() {
    it("can find all movies", function(done) {
      movie.all(function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 5); //jaws maws claws paws gauze

        assert.equal(res[0].title, 'Jaws');
        assert.equal(res[1].title, 'Maws');

        done();
      })
    })

    it("can find some of the movies", function(done) {
      movie.some(2, 3, "id", function(error, result) {
        assert.equal(error, undefined);
        assert(result instanceof Array);
        assert.equal(result.length, 2); //claws paws gauze

        var expected_titles = ['Paws', 'Gauze'],
            actual_titles = [];

        for(var index in result) {
          actual_titles.push(result[index].title);
        }

        assert.deepEqual(expected_titles, actual_titles);
        done();
      })
    })

    it("can put some of the movies in title order", function(done) {
      movie.some(3, 2, "title", function(error, result) {
        assert.equal(error, undefined);
        assert(result instanceof Array);
        assert.equal(result.length, 3); //paws gauze

        var expected_titles = ['Jaws', 'Maws', 'Paws'],
            actual_titles = [];

        for(var index in result) {
          actual_titles.push(result[index].title);
        }

        assert.deepEqual(expected_titles, actual_titles);

        done();
      })
    })

    it("can find a movie by id", function(done){
      movie.find_by("id", 1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);
        assert.equal(res[0].id, 1);
        done();
      })
    })

    it("can find a movie by title", function(done) {
      movie.find_by("title", "Jaws", function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);
        assert.equal(res[0].title, 'Jaws');
        done();
      })
    })

    it("can save changes to a movie", function(done) {
      movie.find_by("title", "Jaws", function(err, res) {
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
        assert.equal(res.inserted_id, 6); //it inserted a new record
        assert.equal(res.changed, 1); //one record was changed

        movie.find_by("title", "RoboJaws", function(err, res) {
          assert.equal(res.length, 1);
          assert.equal(res[0].title, 'RoboJaws'); //we found our new movie
          done();
        })
      })
    });
  })
})

