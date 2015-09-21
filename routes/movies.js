"use strict";

var express = require('express'),
    router = express.Router(),
    Controller = require('../controllers/movies');

router.get('/', function(request, response, next) {
  new Controller().index(function(error, result) {
    if (error) {
      response.status(500).json(error);
    } else {
      response.status(200).json(result);
    }
  })
});

module.exports = router;
