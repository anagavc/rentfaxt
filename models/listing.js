//requiring mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')
const listingSchema = new Schema({
    listingImage: {
        url: String,
        filename: String
    },
    type: String,
    title: String,
    category: String,
    location:String,
    price: String,
    description: String,
    realtor: String,
    email:String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
})

module.exports = mongoose.model('Listing', listingSchema);


