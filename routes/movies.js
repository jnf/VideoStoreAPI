"use strict";

var express = require('express'),
    router = express.Router(),
    Controller = require('../controllers/movies');

router.get('/', new Controller().index);
router.get('/:title', new Controller().show);

module.exports = router;
