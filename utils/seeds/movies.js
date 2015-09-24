"use strict";

module.exports = function(callback) {
  var sqlite3 = require('sqlite3').verbose(),
      db_env  = process.env.DB || 'development',
      db      = new sqlite3.Database('db/' + db_env + '.db'),
      data    = require('./movies-' + db_env + '.json');


  db.serialize(function() {
    // make them tables
    db.exec("BEGIN IMMEDIATE");
    db.exec("DROP TABLE IF EXISTS movies;");
    db.exec(
      "CREATE TABLE movies ( \
        id INTEGER PRIMARY KEY, \
        title TEXT, \
        overview TEXT, \
        release_date TEXT, \
        inventory INTEGER \
      )");

    var movie_statement = db.prepare(
      "INSERT INTO movies(title, overview, inventory, release_date) \
      VALUES (?, ?, ?, ?);"
    );

    // loop them movies
    for(var i in data) {
      // insert each one into the db  
      var movie = data[i];
      movie_statement.run(
        movie.title,
        movie.overview,
        movie.inventory,
        movie.release_date
      );
    }

    movie_statement.finalize();

    db.exec("COMMIT;", function(error) {
      if (error) throw new Error(error);
      if (callback) callback();
      db.close(); // ^_^    
    })
  });
}
