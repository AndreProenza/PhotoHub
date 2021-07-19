var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PhotoSchema = new Schema(
    {
        user: {type: String, required: true, maxlength: 40},
        img: {type: String, required: true, maxlength: 99999999999999999999999999},
        title: {type: String, required: true, maxlength: 100},
        description: {type: String, required: false, maxlength: 500},
        likes: {type: Number, required: true}
    }
)

PhotoSchema
.virtual('url')
.get(function () {
    return '/photoDetails/' + this._id;
});

module.exports = mongoose.model('Photo', PhotoSchema);
