//requring mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Listing = require('./listing');
const UserSchema = new Schema({
    name: String,
    username: String,
    email: String,
    mobile: String,
    listing: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Listing'
        }
    ],
    role: {
        type: String,
        default: 'user'
    }
})
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);