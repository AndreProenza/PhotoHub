var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403)
        }else{
            res.json({
                message: "success",
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