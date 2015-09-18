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

    this.db.close();
  },

  create: function(data, callback) {
    var keys = Object.keys(data);
    var key_pairs = [];
    var values = [];

    for (var i = 0; i < keys.length; i++) {
      values.push(data[keys[i]]);
      key_pairs.push('?');
    }

    var statement = "INSERT INTO movies(" + keys.join(',') + ") " +
                    "VALUES(" + key_pairs.join(',') + ")"

    this.db.run(statement, values, function(err) {
        callback(err, { inserted_id: this.lastID, changed: this.changes });
    });

    this.db.close();
  },

  save: function(data, callback) {
    if (data.id) {
      var keys = Object.keys(data);
      var key_pairs = [];
      var values = [];

      for (var i = 0; i < keys.length; i++) {
        values.push(data[keys[i]]);
        key_pairs.push(keys[i] + "=? ");
      }

      var statement = "UPDATE movies SET " + key_pairs.join(',') + "WHERE id=" + data.id;
      
      this.db.run(statement, values, function(err) {
          callback(err, { inserted_id: this.lastID, changed: this.changes });
      });
      
      this.db.close();

    } else {
      callback({err: "Missing Key", message: "Can't save without an id; use `create`"});
    }
  }
}

module.exports = Movie
