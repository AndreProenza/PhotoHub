var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FavoriteSchema = new Schema(
    {
        user: {
            type: String, 
            required: true, 
            maxlength: 40
        },
        photoId: {
            type: String, 
            required: true
        }
    }
)

FavoriteSchema
.virtual('url')
.get(function () {
    return '/favorites/' + this._id;
});

module.exports = mongoose.model('Favorite', FavoriteSchema);