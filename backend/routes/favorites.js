var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

var favoritesController = require('../controllers/favoritesController');

router.post('/:id', favoritesController.photo_favorite);

router.get('/:id/:user', favoritesController.photo_is_favorite);

router.delete('/:id/:user', favoritesController.photo_unfavorite);

router.get('/:user', favoritesController.get_favorite_photos_id);


router.get('/', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403)
        }else{
            res.json({
                message: "Entered favorites page",
                authData
            })
        }
    })
})

function verifyToken(req, res, next){
    const clientHeader = req.headers['authorization']
    if(typeof clientHeader !== 'undefined'){
        const clientToken = clientHeader
        req.token = clientToken
        next()
    }else {
        res.sendStatus(403);
    }
}

module.exports = router;