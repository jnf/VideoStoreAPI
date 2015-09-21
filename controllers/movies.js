"user strict";

var Movie = require('../models/movie')

function Controller() {

}

Controller.prototype = {
  index: function(request, response, next) {
    new Movie().all(function(error, result) {
      if (error) {
        response.status(500).json(error);
      } else {
        response.status(200).json(result);
      }
    })
  }
}

module.exports = Controller
