const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    role: String,
    favoritePosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);