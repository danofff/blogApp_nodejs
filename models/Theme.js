const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const themeSchema = new Schema({
    themeName: String
});

module.exports = mongoose.model('theme', themeSchema);