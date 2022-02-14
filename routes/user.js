//requiring express
const express = require('express');
//requiring express's router
const router = express.Router();
//requiring the isAdmin middleware
const { isAdmin, isLoggedIn } = require('../middleware');
//requiring the user controller
const controlUser = require('../controllers/users');
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

router.route('/')
    .get(controlUser.renderHomepage)
    .post(controlUser.subscribe);
router.route('/register')
    .get(controlUser.renderRegister)
    .post(controlUser.register);
router.route('/login')
    .get(controlUser.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), controlUser.login);

router.route('/editAccount/:id')
    .get(controlUser.renderEditAccount)
    .put(catchAsync(controlUser.editAccount));
router.route('/dashboard')
    .get(controlUser.renderDashboard);
router.route('/userListings')
    .get(controlUser.renderUserListing);
router.route('/createListing')
    .get(controlUser.renderCreateListing)
    .post(upload.single('listingImage'), controlUser.createListing);
router.route('/listing/:id')
    //route for getting the edit lisitngs form
    .get(isLoggedIn,controlUser.renderEditListing)
    .delete(catchAsync(controlUser.deleteListing))
    .put(isLoggedIn, upload.single('listingImage'), catchAsync(controlUser.updateListing));
router.route('/logout')
    .get(controlUser.logout);
router.route('/about')
    .get(controlUser.renderAboutPage);
router.route('/service/property')
    .get(controlUser.renderPropertyListing);
router.route('/service/brokerage')
    .get(controlUser.renderBrokerageListing);
router.route('/service/land')
    .get(controlUser.renderLandListing);
router.route('/service/:id')
    .get(controlUser.renderListingDetails);
module.exports = router;

