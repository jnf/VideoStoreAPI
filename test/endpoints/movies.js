var request = require('supertest'),
    app     = require('../../app'),
    agent   = request.agent(app);

describe("Endpoints under /movies", function() {
  describe("GET /", function() {
    it("responds with json", function(done) {
      request(app)
        .get('/movies').set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    })
  })
})
