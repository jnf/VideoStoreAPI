"use strict";

var Movie = require('../models/movie');

var Controller = {
  index: function(request, response, next) {
    new Movie().all(Controller.send_json.bind(response))
  },

  show: function(request, response, next) {
    new Movie().find_by('title', request.params.title,
                        Controller.send_json.bind(response));
  },

  paged: function(request, response, next) {
    var limit  = request.params.limit,
        offset = request.params.offset,
        sort   = request.params.sort;
    new Movie().some(limit, offset, sort,
                     Controller.send_json.bind(response));
  },

  create: function(request, response, next) {
    var params = request.body.movie
    new Movie().create(params, Controller.send_json.bind(response));
  },

  send_json: function(error, result) {
    if (error) {
      this.status(500).json(error);
    } else {
      this.status(200).json(result);
    } 
  }
}

module.exports = Controller
