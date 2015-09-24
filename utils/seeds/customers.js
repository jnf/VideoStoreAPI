"use strict";

module.exports = function(callback) {
  var sqlite3 = require('sqlite3').verbose(),
      db_env  = process.env.DB || 'development',
      db      = new sqlite3.Database('db/' + db_env + '.db'),
      data    = require('./customers-' + db_env + '.json');

  db.serialize(function() {
    db.exec('BEGIN IMMEDIATE');
    db.exec("DROP TABLE IF EXISTS customers");
    db.exec(
      "CREATE TABLE customers ( \
        id INTEGER PRIMARY KEY, \
        name TEXT, \
        address TEXT, \
        city TEXT, \
        state TEXT, \
        postal_code TEXT, \
        phone TEXT, \
        registered_at TEXT, \
        account_credit REAL \
      )");

    var customer_statement = db.prepare(
      "INSERT INTO customers( \
        id, name, address, city, state, postal_code, \
        phone, registered_at, account_credit) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
    );

    for (var index in data) {
      var customer = data[index];
      customer_statement.run(
        customer.id,
        customer.name,
        customer.address,
        customer.city,
        customer.state,
        customer.postal_code,
        customer.phone,
        customer.registered_at,
        customer.account_credit
      );
    }

    customer_statement.finalize();

    db.exec("COMMIT;", function(error) {
      if (error) throw new Error(error);
      if (callback) callback();
      db.close(); // ^_^    
    });
  })
}
