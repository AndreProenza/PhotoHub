var User = require('../models/user');

var async = require('async');

exports.photo_post_pfp = function(req, res, next) {
  var username = req.params.user;

  User.findOneAndUpdate({username: username}, {img: req.body.photo,description: req.body.desc}, function(err, photo) {
    if(err){return next(err);}
    res.send({msg:"ok"});
  })
}

exports.photo_get_pfp = function(req, res, next) {
  var username = req.params.user;

  User.findOne({username: username}).exec(function(err, user){
    if(err){return next(err);}
    res.send({img: user.img, description:user.description, user: username});
  });
}
