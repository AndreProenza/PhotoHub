var User = require('../models/user');

exports.register = (req, res, next) => {
    let user = new User ({
        username: req.body.username,
        password: req.body.password
    })
    var usernameCheck = req.body.username
    User.findOne({username: usernameCheck}, function(err, user, cb){
        let userToRegister = new User ({
            username: req.body.username,
            password: req.body.password
        })
        if(err){
            return res.status(500).send();
        }
        if(user){
            res.json({
                message: "User exists"
            })
        }
        if(!user){
            userToRegister.save()
            .then(userToRegister => {
                res.json({
                    message: "User added"
                })
            })
            .catch(userToRegister => {
                res.json({
                    message: "Register failed"
                })
            })
        }
    })
}