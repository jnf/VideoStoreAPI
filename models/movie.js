"use strict";

function Movie() {
  var sqlite3 = require('sqlite3').verbose(),
      db_env = process.env.DB || 'development';
      
  this.db = new sqlite3.Database('db/' + db_env + '.db');
}

Movie.prototype = {
  find: function(title, callback) {
    var statement = "SELECT * FROM movies WHERE title = ?";

    this.db.all(statement, title, function(err, res) {
      if (callback) callback(err, res);
    });
  }
}

module.exports = Movie
