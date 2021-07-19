var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

var photoController = require('../controllers/photoController');

router.get('/home', photoController.photo_list_all)

router.get('/personalArea/:user', photoController.photo_list);

router.post('/personalArea', photoController.photo_post);

router.post('/personalArea/dir', photoController.photo_post_dir);

router.delete('/personalArea/:id', photoController.photo_delete);

router.get('/photoDetails/:id', photoController.photo_get_photoDetails);

router.get('/', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403)
        }else{
            res.json({
                message: "Entered personal area",
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
