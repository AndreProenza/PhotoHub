var User = require('../models/user');
const { body, check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

exports.login = (req, res, next) => {

    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username, password: password}, function(err, user){
        if(err){
            return res.status(500).send();
        }
        if(!user){
            res.json({
                message: "Login failed"
            })
        }else{
            jwt.sign({user}, 'secretkey', (err, token) => {
                res.json({
                    message: "Login success",
                    token, 
                    user
                })
            })
            
        }
    })
}
