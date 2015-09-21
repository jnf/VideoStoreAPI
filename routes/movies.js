"use strict";

var express = require('express'),
    router = express.Router(),
    Controller = require('../controllers/movies');

router.get('/', new Controller().index);

module.exports = router;
