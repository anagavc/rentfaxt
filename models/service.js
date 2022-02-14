//requiring mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//requiring our listings
const Listing = require('./listing')
const serviceSchema = new Schema({
    serviceImage: {
        url: String,
        filename: String
    },
    serviceTitle: String,
    serviceDescription: String,
    listings: [{
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    }]
})
serviceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Listing.deleteMany({ _id: { $in: doc.listings } })
    }
})
module.exports = mongoose.model('Service', serviceSchema);