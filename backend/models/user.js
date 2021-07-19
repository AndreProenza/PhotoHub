var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            maxlength: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            maxlength: 50
        },
        img: {
            type: String,
            required: false,
            maxlength: 99999999999999999999999999,
        },
        description: {
            type: String,
            required: false,
            maxlength: 50,
        },
    }
)

//para do lado do frontend ir buscar a personal area correspondente a este cliente
UserSchema.virtual('url').get(function () {
    return '/personal-area/'+this._id;
});

module.exports = mongoose.model('User', UserSchema);
