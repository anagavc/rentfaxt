//requiring express
const express = require('express');
//requiring express' router
const router = express.Router();
//requiring the isAdmin middleware
const { isAdmin } = require('../middleware');
//requiring the admin controller
const adminController = require('../controllers/admin');
//requiring passport
const passport = require('passport');
//requiring multer
const multer = require('multer');
//requiring cloudinary's storage for uploading of all images
const { storage } = require('../cloudinary');
//specifiying the path where multer is to store all the images
const upload = multer({ storage });
//requiring the catchAsync error handler
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    //route to get the registration page
    .get(adminController.renderRegister)
    .post(catchAsync(adminController.register));


router.route('/login')
    //route to get the login page
    .get(adminController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), adminController.login);
router.route('/overview')
    //the route to get the overview page
    .get(isAdmin, catchAsync(adminController.renderDashboard));

router.route('/services')
    //the route to get the services page
    .get(isAdmin, catchAsync(adminController.renderServices));

router.route('/createService')
    .get(isAdmin, adminController.renderCreateService)
    .post(isAdmin, upload.single('serviceImage'), catchAsync(adminController.createService));

router.route('/services/:id')
    .get(isAdmin, adminController.renderEditService)
    .delete(isAdmin, catchAsync(adminController.deleteService))
    .put(isAdmin, upload.single('serviceImage'), catchAsync(adminController.updateService));

router.route('/users')
    //the route for getting the faq page
    .get(isAdmin, catchAsync(adminController.renderUser));
router.route('/users/:id')
    //the route for getting the faq page
    .delete(isAdmin, catchAsync(adminController.deleteUser));
router.route('/reviews')
    //the route for getting the reviews page
    .get(isAdmin, catchAsync(adminController.renderReviews));

router.route('/createReview')
    .get(isAdmin, adminController.renderCreateReview)
    .post(isAdmin, upload.single('reviewImage'), catchAsync(adminController.createReview));

router.route('/reviews/:id')
    .get(isAdmin, adminController.renderEditReview)
    .delete(isAdmin, catchAsync(adminController.deleteReview))
    .put(isAdmin, upload.single('reviewImage'), catchAsync(adminController.updateReview));

router.route('/faq')
    //the route for getting the faq page
    .get(isAdmin, catchAsync(adminController.renderFAQ));

router.route('/createFAQ')
    .get(isAdmin, adminController.renderCreateFAQ)
    .post(isAdmin, catchAsync(adminController.createFAQ));

router.route('/faq/:id')
    .get(isAdmin, adminController.renderEditFAQ)
    .delete(isAdmin, catchAsync(adminController.deleteFAQ))
    .put(isAdmin, catchAsync(adminController.updateFAQ));

router.route('/listings')
    //route for getting the listings page
    .get(isAdmin, adminController.renderListing);

router.route('/createListing')
    .get(isAdmin, adminController.renderCreateListing)
    .post(isAdmin, upload.single('listingImage'), catchAsync(adminController.createListing));
router.route('/listings/:id')
    //route for getting the edit lisitngs form
    .get(isAdmin, adminController.renderEditListing)
    .delete(isAdmin, catchAsync(adminController.deleteListing))
    .put(isAdmin, upload.single('listingImage'), catchAsync(adminController.updateListing));
router.route('/subscribers')
    .get(isAdmin, adminController.renderSubscribers);
router.route('/websiteSettings')
    .get(isAdmin, adminController.renderWebsiteSettings)
    .post(isAdmin, upload.single('favicon'), catchAsync(adminController.websiteSetting));
router.route('/editWebsiteSettings')
    .get(isAdmin, adminController.renderEditWebsiteSetting);
router.route('/editWebsiteSettings/:id')
    .put(isAdmin, upload.single('favicon'), catchAsync(adminController.updateWebsiteSetting));
router.route('/heroPageSettings')
    .get(isAdmin, adminController.renderHeroPageSettings)
    .post(isAdmin, upload.single('heroImage'), catchAsync(adminController.heroPageSetting));
router.route('/editHeroPage')
    .get(isAdmin, adminController.renderEditHeroPage);
router.route('/editHeroPage/:id')
    .put(isAdmin, upload.single('heroImage'), catchAsync(adminController.updateHeroPage));
router.route('/aboutPageSettings')
    .get(isAdmin, adminController.renderAboutPageSettings)
    .post(isAdmin, upload.single('aboutImage'), catchAsync(adminController.aboutPageSetting));
router.route('/editAboutPage')
    .get(isAdmin, adminController.renderEditAboutPage);
router.route('/editAboutPage/:id')
    .put(isAdmin, upload.single('aboutImage'), catchAsync(adminController.updateAboutPage));
router.route('/logout')
    .get(isAdmin, catchAsync(adminController.logout))
module.exports = router;
