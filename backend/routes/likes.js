var express = require('express');
var router = express.Router();

var likeController = require('../controllers/likesController');

router.post('/:id', likeController.photo_like);

router.get('/:id/:user', likeController.photo_is_liked);

router.delete('/:id/:user', likeController.photo_unlike);

router.get('/:user', likeController.get_liked_photos_id);

module.exports = router;
