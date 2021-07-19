var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

router.post('/:user', userController.photo_post_pfp);

router.get('/:user', userController.photo_get_pfp);

module.exports = router;
