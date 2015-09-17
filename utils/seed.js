"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movies = require('./movies');
//insert into movies(title, inventory) values("Jaws", 10);
var movie_statement = db.prepare(
  "INSERT INTO movies(title, overview, inventory, release_date) \
  VALUES (?, ?, ?, ?);"
);

db.serialize(function() {
  // loop them movies
  for(var i = 0; i < movies.length; i++) {
    var movie = movies[i];

    // insert each one into the db  
    movie_statement.run(
      movie.title,
      movie.overview,
      movie.inventory,
      movie.release_date
    );
  }

  movie_statement.finalize();
});

db.close(); // ^_^
