"use strict";

var movies    = require('./seeds/movies'),
    customers = require('./seeds/customers');

console.log('Seeding movies...');
movies.call();

console.log('Seeding customers...');
customers.call();
