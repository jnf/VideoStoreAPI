"use strict";

var express = require('express'),
    router = express.Router(),
    Controller = require('../controllers/movies');

router.get('/', Controller.index);
router.get('/:title', Controller.show);

module.exports = router;
