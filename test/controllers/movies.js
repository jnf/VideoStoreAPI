var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    seeder  = require('../../utils/seeds/movies'),
    agent   = request.agent(app);

describe("Endpoints under /movies", function() {
  beforeEach(function(done) {
    seeder(done)
  })

  describe("GET all movies", function() {
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
        assert.equal(result.body.length, 5); //the db_cleaner inserted two records

        var keys = ['id', 'title', 'overview', 'release_date', 'inventory'];
        assert.deepEqual(Object.keys(result.body[0]), keys);
        done();
      })
    })
  })

  describe("GET a subset of movies", function() {
    var movie_request;

    it("can get subset of movies in title order", function(done) {
      movie_request = agent.get('/movies/n/3/o/1/s/title').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 3);

          var expected_names = ['Gauze', 'Jaws', 'Maws'],
          actual_names = [];

          for(var index in result.body) {
            actual_names.push(result.body[index].title);
          }

          assert.deepEqual(expected_names, actual_names);
          done(error);
        })
    })

    it("can get a subset of movies in release_date order", function(done){
      movie_request = agent.get('/movies/n/3/o/1/s/release_date').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 3);
          var expected_names = ['Claws', 'Maws', 'Gauze'],
          actual_names = [];

          for(var index in result.body) {
            actual_names.push(result.body[index].title);
          }

          assert.deepEqual(expected_names, actual_names);

          done(error);
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

  describe("POST a new movie", function() {
    var movie_post;

    beforeEach(function(done) {
      var data = {
        title: "RoboJaws",
        overview: "Jaws is hunted by RoboJaws",
        release_date: "Tomorrow",
        inventory: 10
      }

      movie_post = agent.post('/movies')
        .set('Accept', 'application/json')
        .send({movie: data})
      done()
    })

    it("can create a new movie", function(done) {
      movie_post
        .expect('Content-Type', /application\/json/)
        .expect({ inserted_id: 6, changed: 1 })
        .expect(200, done)
    })
  })
})
