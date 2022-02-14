const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    reviewImage: {
        url: String,
        filename: String
    },
    reviewer: String,
    review: String
})

module.exports = mongoose.model('Review', reviewSchema)