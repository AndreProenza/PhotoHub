var User = require('../models/user');
var Likes = require('../models/likes');
var Photo = require('../models/photo');

exports.photo_like = (req, res, next) => {
    var username = req.body.username;
    var photoId = req.body.photoId;
    // 1º Procurar photo
    // 2º Fazer update do campo likes

    Photo.findById(photoId).exec(function (err,found_photo){
        if(err){return next(err);
        }
        found_photo.likes+=1;
        Photo.findByIdAndUpdate(photoId, found_photo, function abc(err){
          if(err){return next(err);}
        });
      });



    //     // 3º Tabela Likes
    //     // 4º adicionar nova like com mais um like
      var like;
      like = new Likes({user: username, photoId: photoId});
      Likes.findOne({user: username,photoId: photoId}).exec(function(err,found_like){
        if(err){
          res.send({msg: "Server error while saving in data base"});
          return next(err);
        }
        if(found_like) {
          res.send({msg: "Like is already in System", ok:0});
        } else {
          like.save(function(err){
            if(err){return next(err);}
            res.send({msg: "Like uploaded!", ok:1});
          });
        }
      });
}

exports.photo_is_liked = (req, res, next) => {
  var photoId = req.params.id;
  var user = req.params.user;

  like = new Likes({user: user, photoId: photoId})
  Likes.findOne({user: user, photoId: photoId}).exec(function(err,found_like){
    if(err){
      res.send({msg: "Server error while saving in data base"});
      return next(err);
    }
    if(found_like) {
      res.send({msg: "Like is already in System", ok:0});
    } else {
        res.send({msg: "Like does not exist!", ok:1});
    }
  });
}

exports.photo_unlike = (req, res, next) => {
  var username = req.params.user;
  var photoId = req.params.id;
;
  // 1º Procurar photo
  // 2º Fazer update do campo likes

  Photo.findById(photoId).exec(function (err,found_photo){
      if(err){return next(err);
      }
      found_photo.likes-=1;
      Photo.findByIdAndUpdate(photoId, found_photo, function abc(err){
        if(err){return next(err);}
      });
    });
  //     // 3º Tabela Likes
  //     // 4º adicionar nova like com mais um like
    Likes.findOneAndRemove({user: username,photoId: photoId}).exec(function(err){
      if(err){
        res.send({msg: "Server error while saving in data base"});
        return next(err);
      }
      res.send({msg: "Like removed.", ok:0});

    });
}

exports.get_liked_photos_id = (req, res, next) => {
  var username = req.params.user;
  //ir a BD à tabela Like procurar por Likes com o username
  Likes.find({user: username}).exec(function(err,list_photos){
    if(err){return next(err);}
    res.send(list_photos);
  });
}
