const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    theme: {
       type: Schema.Types.ObjectId,
       ref: "Theme",
       required: true
    },
    preview: String,
    text: String,
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Post', postSchema);