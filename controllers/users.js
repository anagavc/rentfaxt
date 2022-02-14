const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//passing in our mapbox token
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const Review = require('../models/review');
const Service = require('../models/service');
const FAQ = require('../models/faq');
const Listing = require('../models/listing');
const Website = require('../models/websitesettings');
const Hero = require('../models/hero');
const About = require('../models/about');
const User = require('../models/user');
const Subscriber = require('../models/subscriber');
const { isAdmin, isLoggedIn } = require('../middleware');

//models with specific id's


//this renders the index page with all the neccessary data from the database
module.exports.renderHomepage = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    const hero = await Hero.findById("6110e0140d51ef5d0c00620f");
    const about = await About.findById("6110da90f5503d7340cd0a2c")
    const reviews = await Review.find({})
    const services = await Service.find({})
    const faqs = await FAQ.find({})
    const listings = await Listing.find({})
    res.render('user/index', { website, hero, about, reviews, services, faqs, listings })
}

//this renders the registration page
module.exports.renderRegister = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/register', { website })
}

//this saves the newly registered user to the database
module.exports.register = async (req, res) => {
    try {
        const { name, mobile, email, username, password } = req.body;
        const user = new User({ name, mobile, email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next();
            req.flash('success', 'Welcome to Rentfaxt');
            res.redirect('dashboard');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

//this renders the login form
module.exports.renderLogin = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/login', { website })
}
//this controls the logging in of a user
module.exports.login = (req, res) => {
    if (!isAdmin) {
        req.flash('success', 'Welcome back');
        const redirectUrl = req.session.returnTo || '/dashboard'
        delete req.session.returnTo;
        res.redirect(redirectUrl);


    }
    else {
        req.flash('success', 'Welcome Admin');
        const redirectUrl = req.session.returnTo || 'admin/overview'
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
}

//this logs out a user
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully logged out')
    res.redirect('/login');
}

//this renders the user dashboard
module.exports.renderDashboard = async (req, res) => {
    const user = req.user._id;
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/userDashboard', { user, website })

}
//this renders the page for edit a user's details
module.exports.renderEditAccount = async (req, res) => {
    const users = req.user;
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/editAccount', { users, website })
}
module.exports.editAccount = async (req, res) => {
    const id = req.user.id;
    const user = await User.findByIdAndUpdate(id, req.body)
    await user.save()
    req.flash('success', 'Successfully updated your account')
    res.redirect('../dashboard')
}

//this renders all the listings a user has
module.exports.renderUserListing = async (req, res) => {
    const user = req.user;
    const listings = await Listing.find({ realtor: user.username });
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/userListings', { listings, website })
}

//this renders the page for a user to create a listing
module.exports.renderCreateListing = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/createListing', { website })
}

//this saves a newly created listing
module.exports.createListing = async (req, res) => {
    //extracting
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const user = req.user;
    const listing = new Listing(req.body);
    listing.geometry = geoData.body.features[0].geometry;
    listing.listingImage.url = req.file.path;
    listing.listingImage.filename = req.file.filename;
    listing.email = user.email
    listing.realtor = user.username;
    await listing.save();
    req.flash('success', 'You have successfully added a new listing')
    res.redirect('../userListings')
}

//this deletes a listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(listing.listingImage.filename);
    req.flash('success', 'You have successfully deleted this listing')
    res.redirect('../userListings')
}

//this renders the form for editing a listing
module.exports.renderEditListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const website = await Website.findById("611629fda3e7a965b8f44e13");

    res.render('user/editListing', { listing, website })
}

//this saves the updated lisiting
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body);
    if (req.file) {
        await cloudinary.uploader.destroy(listing.listingImage.filename)
        listing.listingImage.url = req.file.path;
        listing.listingImage.filename = req.file.filename;
    }
    await listing.save()
    req.flash('success', 'Successfully updated the listing')
    res.redirect('../userListings')
}


//this renders the about page 
module.exports.renderAboutPage = async (req, res) => {
    const about = await About.findById("6110da90f5503d7340cd0a2c")
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/about', { about, website })

}

//this render the listing for a particular service type
module.exports.renderPropertyListing = async (req, res) => {
    const listings = await Listing.find({ type: "propertyManagement" });
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/listings', { listings, website })
}

//this render the listing for a particular service type
module.exports.renderBrokerageListing = async (req, res) => {
    const listings = await Listing.find({ type: "brokerage" });
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/listings', { listings, website })
}
//this render the listing for a particular service type
module.exports.renderLandListing = async (req, res) => {
    const listings = await Listing.find({ type: "landSales" });
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/listings', { listings, website })
}

//this renders the details about a particular listing
module.exports.renderListingDetails = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('user/listingDetails', { listing, website })
}

//this saves a subscriber from the footer subscribe
module.exports.subscribe = async (req, res) => {
    const subscriber = new Subscriber(req.body);
    await subscriber.save();
    req.flash('success', 'Thank you for subscribing to our newsletter')
    res.redirect('back')
}

//this passes the homepage data into the boilerplate to enable one manipulate the website's title
module.exports.boilerplate = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('layouts/boilerplate', { website });
}

//this passes the homepage data into the boilerplate to enable one manipulate the website's title
module.exports.adminBoilerplate = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('layouts/adminBoilerplate', { website });
}