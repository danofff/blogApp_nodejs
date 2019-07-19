const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    theme: {
       type: Schema.Types.ObjectId,
       ref: 'Theme',
       required: true
    },
    preview: String,
    text: String,
    date: {
        type: Date,
        default: Date.now()
    },
    author: {
        id:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    ratedUsers: [
        {
            type: String
        }
    ],
    rate: Number,
    watched: Number,
    favorite: Number
});

module.exports = mongoose.model('Post', postSchema);