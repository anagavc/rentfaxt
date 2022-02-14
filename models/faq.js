const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const faqSchema = new Schema({
    question: String,
    answer: String
})

module.exports = mongoose.model('FAQ', faqSchema)