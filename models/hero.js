//requiring mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heroSchema = new Schema({
    heroImage: {
        url: String,
        filename: String
    },
    mainCaption: String,
    subCaption: String
})

module.exports = mongoose.model('Hero', heroSchema);