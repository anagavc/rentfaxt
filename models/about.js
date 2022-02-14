//requiring mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutSchema = new Schema({
    aboutImage: {
        url: String,
        filename: String
    },
    aboutText: String
})

module.exports = mongoose.model('About', aboutSchema);