"use strict";

var express = require('express'),
    router = express.Router(),
    Controller = require('../controllers/movies');

router.get('/', Controller.index);
router.get('/n/:limit/o/:offset/s/:sort', Controller.paged);
router.get('/:title', Controller.show);

router.post('/', Controller.create);

module.exports = router;
