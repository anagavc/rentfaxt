const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//passing in our mapbox token
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const User = require('../models/user');
const Review = require('../models/review');
const Service = require('../models/service');
const FAQ = require('../models/faq');
const Listing = require('../models/listing');
const Subscriber = require('../models/subscriber');
const Website = require('../models/websitesettings');
const Hero = require('../models/hero');
const About = require('../models/about');


module.exports.renderRegister = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/register', { website });
};


module.exports.register = async (req, res, next) => {
    try {
        const { mobile, username, password, email, role } = req.body;
        const admin = new User({ username, mobile, email, role });
        const registeredAdmin = await User.register(admin, password);
        req.login(registeredAdmin, err => {
            if (err) return next();
            req.flash('success', 'Welcome Admin');
            res.redirect('overview');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

//rendering the login form
module.exports.renderLogin = async (req, res) => {
    res.render('admin/login');
};

//this facilitates the login process even though it is passport.authenticate that is handling the login
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Admin');
    const redirectUrl = 'overview'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
//rendering the admin dashboard page
module.exports.renderDashboard = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/overview', { website })
}

//rendering the services page
module.exports.renderServices = async (req, res) => {
    const services = await Service.find({})
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/services', { services, website })
}

//rendering the page for adding services
module.exports.renderCreateService = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/addService', { website });
}

//saving the newly added service
module.exports.createService = async (req, res) => {
    const user = req.session.passport.user;
    const service = new Service(req.body);
    service.serviceImage.url = req.file.path;
    service.serviceImage.filename = req.file.filename;
    console.log(user)
    await service.save();
    req.flash('success', 'Successfully added the service')
    res.redirect('services')
}

//this is how to delete a  service
module.exports.deleteService = async (req, res) => {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(service.serviceImage.filename)
    req.flash('success', 'You have successfully deleted this service')
    res.redirect('../services')
}

//this renders the edit service form
module.exports.renderEditService = async (req, res) => {
    const { id } = req.params;
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    const services = await Service.findById(id);
    res.render('admin/editService', { services, website })
}

//this saves the updated service information to the database
module.exports.updateService = async (req, res) => {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body);
    if (req.file) {
        await cloudinary.uploader.destroy(service.serviceImage.filename)
        service.serviceImage.url = req.file.path;
        service.serviceImage.filename = req.file.filename;
    }
    await service.save()
    req.flash('success', 'Successfully updated the service')
    res.redirect('../services')
}
//rendering the reviews page
module.exports.renderReviews = async (req, res) => {
    const reviews = await Review.find({});
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/reviews', { reviews, website })
}

//rendering the addReview page
module.exports.renderCreateReview = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/addReview', { website });
}

//saving newly added reviews
module.exports.createReview = async (req, res) => {
    const review = new Review(req.body);
    review.reviewImage.url = req.file.path;
    review.reviewImage.filename = req.file.filename;
    await review.save()
    req.flash('success', 'Successfully added the review')
    res.redirect('reviews')
}
//deleting a review
module.exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(review.reviewImage.filename)
    req.flash('success', 'You have successfully deleted this review')
    res.redirect('../reviews')
}
//this renders the edit review form
module.exports.renderEditReview = async (req, res) => {
    const { id } = req.params;
    const reviews = await Review.findById(id);
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/editReview', { reviews, website })
}

//saving the updated review
module.exports.updateReview = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { ...req.body })
    if (req.file) {
        await cloudinary.uploader.destroy(review.reviewImage.filename)
        review.reviewImage.url = req.file.path;
        review.reviewImage.filename = req.file.filename;
    }
    await review.save()
    req.flash('success', 'Successfully updated the review')
    res.redirect('../reviews')
}

//rendering the faq page
module.exports.renderFAQ = async (req, res) => {
    const faqs = await FAQ.find({});
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/faqs', { faqs, website })
}
//rendering the add FAQ page
module.exports.renderCreateFAQ = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/addFAQ', website);
}

//saving newly added faqs
module.exports.createFAQ = async (req, res) => {
    const faq = new FAQ(req.body);
    await faq.save()
    req.flash('success', 'Successfully added the faq')
    res.redirect('faq')
}

//deleting a FAQ
module.exports.deleteFAQ = async (req, res) => {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    req.flash('success', 'You have successfully deleted this FAQ')
    res.redirect('faq')
}

//this renders the edit FAQ form
module.exports.renderEditFAQ = async (req, res) => {
    const { id } = req.params;
    const faqs = await FAQ.findById(id);
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/editFAQ', { faqs, website })
}

//saving the updated FAQ
module.exports.updateFAQ = async (req, res) => {
    const { id } = req.params;
    await FAQ.findByIdAndUpdate(id, { ...req.body })
    req.flash('success', 'Successfully updated the FAQ')
    res.redirect('../faq')
}

//this renders the users table
module.exports.renderUser = async (req, res) => {
    const users = await User.find({});
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/users', { users, website })
}

//this deletes a user
module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash('success', 'You have successfully deleted this user')
    res.redirect('../users')
}

//rendering the listings
module.exports.renderListing = async (req, res) => {
    const user = req.user;
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    const listings = await Listing.find({ realtor: user.username })
    res.render('admin/listing', { listings, website })
}

//this renders the form for creating a listing
module.exports.renderCreateListing = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/addListing', { website })
}

//this saves a newly created listing
module.exports.createListing = async (req, res) => {
    //extracting the locarion from the req.body and saving to listing geometry
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
    req.flash('success', 'Successfully added the listing')
    res.redirect('listings')
}

//this deletes a listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(listing.listingImage.filename);
    req.flash('success', 'You have successfully deleted this listing')
    res.redirect('../listings')
}

//this renders the form for editing a listing
module.exports.renderEditListing = async (req, res) => {
    const { id } = req.params;
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    const listing = await Listing.findById(id);
    res.render('admin/editListing', { listing, website })
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
    res.redirect('../listings')
}

//this renders the subscribers page
module.exports.renderSubscribers = async (req, res) => {
    const subscribers = await Subscriber.find({})
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/subscribers', { subscribers, website })
}

//this renders the web settings page
module.exports.renderWebsiteSettings = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/websiteSettings', { website })
}

//this saves the website settings to the database
module.exports.websiteSetting = async (req, res) => {
    const website = new Website(req.body);
    website.favicon.url = req.file.path;
    website.favicon.filename = req.file.filename;
    await website.save();
    req.flash('success', 'Successfully saved the website settings');
    res.redirect('overview')
}

//this renders the edit website form
module.exports.renderEditWebsiteSetting = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/editWebsiteSettings', { website });
}

//this saves the updated website setting 
module.exports.updateWebsiteSetting = async (req, res) => {
    const website = await Website.findByIdAndUpdate("611629fda3e7a965b8f44e13", req.body)
    if (req.file) {
        await cloudinary.uploader.destroy(website.favicon.filename);
        website.favicon.url = req.file.path;
        website.favicon.filename = req.file.filename;
    }
    await website.save()
    req.flash('success', 'Successfully update the website settings')
    res.redirect('../overview')
}

//this renders the heropage settings form
module.exports.renderHeroPageSettings = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/herosettings', { website })
}

//this saves the hero page settings to the database
module.exports.heroPageSetting = async (req, res) => {
    const hero = new Hero(req.body);
    hero.heroImage.url = req.file.path;
    hero.heroImage.filename = req.file.filename;
    await hero.save();
    req.flash('success', 'Successfully saved the hero page settings');
    res.redirect('overview')
}
//this renders the edit heropage form
module.exports.renderEditHeroPage = async (req, res) => {
    const hero = await Hero.findById("6110e0140d51ef5d0c00620f");
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/editHeroSettings', { hero, website })
}

//this saves the updated hero setting
module.exports.updateHeroPage = async (req, res) => {
    const hero = await Hero.findByIdAndUpdate("6110e0140d51ef5d0c00620f", req.body);
    if (req.file) {
        await cloudinary.uploader.destroy(hero.heroImage.filename);
        hero.heroImage.url = req.file.path;
        hero.heroImage.filename = req.file.filename;
    }
    await hero.save()
    req.flash('success', 'Successfully updated the hero page')
    res.redirect('../overview')
}

//this renders the about page settings
module.exports.renderAboutPageSettings = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/aboutSettings', { website })
}

//this saves the about page settings to the database
module.exports.aboutPageSetting = async (req, res) => {
    const about = new About(req.body);
    about.aboutImage.url = req.file.path;
    about.aboutImage.filename = req.file.filename;
    await about.save();
    req.flash('success', 'Successfully saved the about page settings');
    res.redirect('overview')
}

//this renders the edit aboutpage form
module.exports.renderEditAboutPage = async (req, res) => {
    const about = await About.findById("6110da90f5503d7340cd0a2c")
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('admin/editAboutSettings', { about, website })
}
//this saves the update about page details to the database
module.exports.updateAboutPage = async (req, res) => {
    const about = await About.findByIdAndUpdate("6110da90f5503d7340cd0a2c", req.body)
    if (req.file) {
        await cloudinary.uploader.destroy(about.aboutImage.filename);
        about.aboutImage.url = req.file.path;
        about.aboutImage.filename = req.file.filename;
    }
    await about.save()
    req.flash('success', 'Successfully updated the about page')
    res.redirect('../overview')
}


//this passes the homepage data into the boilerplate to enable one manipluae the wesite's title
module.exports.adminBoilerplate = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    console.log(website.favicon.url)
    res.render('layouts/adminBoilerplate', { website });
}

//this passes the homepage data into the boilerplate to enable one manipulate the website's title
module.exports.boilerplate = async (req, res) => {
    const website = await Website.findById("611629fda3e7a965b8f44e13");
    res.render('layouts/boilerplate', { website });
}

//this logs out the admin
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully logged out')
    res.redirect('../login')
}