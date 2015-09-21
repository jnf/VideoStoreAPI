"user strict";

var Movie = require('../models/movie')

function Controller() {

}

Controller.prototype = {
  index: function(callback) {
    new Movie().all(callback)
  }
}

module.exports = Controller
