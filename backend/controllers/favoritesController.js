var User = require('../models/user');
var Favorites = require('../models/favorites');
var Photo = require('../models/photo');

exports.photo_favorite = (req, res, next) => {
    var username = req.body.username;
    var photoId = req.body.photoId;
    
    Favorites.findById(photoId).exec(function (err,found_photo){
        if(err){return next(err);
        }
      });

      var favorite;
      favorite = new Favorites({user: username, photoId: photoId});
      Favorites.findOne({user: username,photoId: photoId}).exec(function(err,found_favorite){
        if(err){
          res.send({msg: "Server error while saving in data base"});
          return next(err);
        }
        if(found_favorite) {
          res.send({msg: "Favorite is already in System", ok:0});
        } else {
          favorite.save(function(err){
            if(err){return next(err);}
            res.send({msg: "Favorite uploaded!", ok:1});
          });
        }
      }); 
}

exports.photo_is_favorite = (req, res, next) => {
  var photoId = req.params.id;
  var user = req.params.user;

  favorite = new Favorites({user: user, photoId: photoId})
  Favorites.findOne({user: user, photoId: photoId}).exec(function(err,found_favorite){
    if(err){
      res.send({msg: "Server error while saving in data base"});
      return next(err);
    }
    if(found_favorite) {
      res.send({msg: "Favorite is already in System", ok:0});
    } else {
        res.send({msg: "Favorite does not exist!", ok:1});
    }
  });
}

exports.photo_unfavorite = (req, res, next) => {
  var username = req.params.user;
  var photoId = req.params.id;
  
  Photo.findById(photoId).exec(function (err,found_photo){
      if(err){return next(err);
      }
    });
    Favorites.findOneAndRemove({user: username,photoId: photoId}).exec(function(err){
      if(err){
        res.send({msg: "Server error while saving in data base"});
        return next(err);
      }
      res.send({msg: "Favorite removed.", ok:0});
      
    }); 
}

exports.get_favorite_photos_id = (req, res, next) => {
  var username = req.params.user;
  //ir a BD à tabela Favorites procurar por favorites com o username 
  Favorites.find({user: username}).exec(function(err,list_photos){
    if(err){return next(err);}
    res.send(list_photos);
  });
}

