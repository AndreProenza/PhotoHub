var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LikeSchema = new Schema(
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

LikeSchema
.virtual('url')
.get(function () {
    return '/like/' + this._id;
});

module.exports = mongoose.model('Like', LikeSchema);