const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const themeSchema = new Schema({
    themeName: String,
    themeDescription: String
});

module.exports = mongoose.model('Theme', themeSchema);