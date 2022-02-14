//requiring mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const websiteSchema = new Schema({
    favicon: {
        url: String,
        filename: String
    },
    title: String,
    fblink: String,
    iglink: String,
    linkedinlink: String
})

module.exports = mongoose.model('Website', websiteSchema);