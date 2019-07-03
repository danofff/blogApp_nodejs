const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    theme: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: 'Theme'
        },
        themeName: String
    },
    text: String,
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Post', postSchema);