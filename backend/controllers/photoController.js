var Photo = require('../models/photo');
var Like = require('../models/likes');
var Favorite = require('../models/favorites');

var async = require('async');

exports.photo_post = function(req, res, next) {
  var photo;
  if(req.body.description) {
    photo = new Photo({user:req.body.user,
                       img:req.body.img,
                       title:req.body.title,
                       description:req.body.description,
                       likes:req.body.likes});
  } else {
    photo = new Photo({user:req.body.user,
                       img:req.body.img,
                       title:req.body.title,
                       likes:req.body.likes});
  }
  Photo.findOne({user:req.body.user,img:req.body.img}).exec(function(err,found_photo){
    if(err){
      res.send({msg: "Server error while saving to data base"});
      return next(err);
    }
    if(found_photo) {
      res.send({msg: "Photo is already in System", ok:0});
    } else {
      photo.save(function(err){
        if(err){return next(err);}
        res.send({msg: "Photo uploaded!", ok:1});
      });
    }
  });
};

exports.photo_list = function(req, res, next) {
  Photo.find({user:req.params.user}).exec(function(err, list_photos){
    if(err){return next(err);}
    res.send(list_photos);
  });
};

exports.photo_delete = function(req, res, next) {
  Photo.findByIdAndRemove(req.params.id, async function(err, photo){
    if(err){return next(err);}

    await Like.find({photoId: req.params.id}).remove().exec(function(err){
      if(err){return next(err);}
    });

    await Favorite.find({photoId: req.params.id}).remove().exec(function(err){
      if(err){return next(err);}
    });

    await res.send("apagado");
  });
};

exports.photo_list_all = function(req, res, next) {
  Photo.find().exec(function(err, list_photos){
    if(err){return next(err);}
    res.send(list_photos);
  });
};

exports.photo_get_photoDetails = function(req, res, next) {
  Photo.findById(req.params.id).exec(function(err, foundPhoto){
    if(err){
      return next(err);
    }
    res.send(foundPhoto);
  });
}


exports.photo_post_dir = async function(req, res, next) {

  function save(photo) {
    return photo.save().then(function(res, err){
      if(err){return 0;}
      else{return 1;}
    });
  }

  function find(image) {
    var photo;
    return Photo.findOne({user:image.user, img:image.img}).then(function(err){
      if(err){
        return photo;
      }

      if(image.description) {
        photo = new Photo({user:image.user,
                           img:image.img,
                           title:image.title,
                           description:image.description,
                           likes:image.likes});
      } else {
        photo = new Photo({user:image.user,
                           img:image.img,
                           title:image.title,
                           likes:image.likes});
      }

      return photo;
    });
  }

  var count = 0;
  async.eachSeries(req.body, async function(image){

     var photo = await find(image);
     if(!photo){
       console.log("Já existe: " + image.title);
       return;
     }


     var res = await save(photo);
     if(res) {
       console.log("Guardada: " + photo.title);
     } else {
       console.log("Erro ao guardar: " + photo.title);
     }

     count += res;

  })
  .then(function() {
    if(count == req.body.length) {
      res.send({msg: "All photos uploaded!", ok:1});
    } else {
      res.send({msg: "Server error while saving to database", ok:-1});
    }
  });

}
