"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development';
    
module.exports = {
  some: function(limit, offset, sort, callback) {
    sort = sort || "id";
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name +
        " ORDER BY " + sort +
        " LIMIT " + limit + " OFFSET " + offset;

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    })
  },

  all: function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name;

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  find_by: function(column, value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " WHERE " + column + " = ?";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  create: function(data, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var keys = Object.keys(data);
    var key_pairs = [];
    var values = [];

    for (var i = 0; i < keys.length; i++) {
      values.push(data[keys[i]]);
      key_pairs.push('?');
    }

    var statement = "INSERT INTO "+ this.table_name + " (" + keys.join(',') + ") " +
                    "VALUES(" + key_pairs.join(',') + ")"

    db.run(statement, values, function(err) {
      callback(err, { inserted_id: this.lastID, changed: this.changes });
      db.close();
    });
  },

  save: function(data, callback) {
    if (data.id) {
      var db = new sqlite3.Database('db/' + db_env + '.db');
      var keys = Object.keys(data);
      var key_pairs = [];
      var values = [];

      for (var i = 0; i < keys.length; i++) {
        values.push(data[keys[i]]);
        key_pairs.push(keys[i] + "=? ");
      }

      var statement = "UPDATE " + this.table_name + " SET " + key_pairs.join(',') + "WHERE id=" + data.id;
      
      db.run(statement, values, function(err) {
        callback(err, { inserted_id: this.lastID, changed: this.changes });
        db.close();
      });
    } else {
      callback({err: "Missing Key", message: "Can't save without an id; use `create`"});
    }
  }
}
