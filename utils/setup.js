"use strict";

var movies    = require('./seeds/movies'),
    customers = require('./seeds/customers');

console.log('Seeding movies...');
movies(function() { console.log('Seeded movies!')});

console.log('Seeding customers...');
customers.call();
