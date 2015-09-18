"use strict";

function Movie() {
  this.table_name = "movies";
}

Movie.prototype = require('../database');

module.exports = Movie
