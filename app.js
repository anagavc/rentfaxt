//setting up the app to use the  local .env while in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//requiring express as the server
const express = require('express');
//executing express
const app = express();
// requiring express's built in path
const path = require('path');
//requiring mongoose
const mongoose = require('mongoose');
//requiring the error class we created
const ExpressError = require('./utils/ExpressError');
//requiring passport
const passport = require('passport');
//requiring passport-local
const LocalStrategy = require('passport-local');
//requiring the route for the user
const userRoutes = require('./routes/user');
//requiring the route for the admin
const adminRoutes = require('./routes/admin');
//requiring sessions
const session = require('express-session');
//requiring methodOverride
const methodOverride = require('method-override');
// requrings ejs-mate for handling of ejs templating system
const ejsMate = require('ejs-mate');
//requiring our connect-flash
const flash = require('connect-flash');
//requiirng express-mongo-sanitize that aids in preventing mongo injection
const mongoSanitize = require('express-mongo-sanitize');
//requiirng helmet that will enbale us set up our content security policy
const helmet = require("helmet");
//requiring connect-mongo
const MongoStore = require('connect-mongo');
//creating a variable to contain both the remote adnd local database
const dbUrl = process.env.DB_URL;
//creating a secret that will further aid in protecting the app's sessions
const secret = process.env.SECRET || 'topsecret';
//setting the application's port
const port = process.env.PORT || 3000;
//requiring the user model 
const User = require('./models/user');
//this tells express to make use of ejs locals for all ejs templates
app.engine('ejs', ejsMate);
//setting the view engine to be ejs
app.set('view engine', 'ejs');
//joining the views directory with path
app.set('views', path.join(__dirname, 'views'));
//this will enable us serve the files in our public directory
app.use(express.static(path.join(__dirname, 'public')));
//setting up the database connection using mongoose
mongoose.connect(dbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

//logic for checking for errors with the database
const db = mongoose.connection;
db.on("error", console.error.bind("connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

//creating a new store variable that will enable us use connect-mongo
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
store.on('error', function (e) {
    console.log("SESSION STORE ERROR", e)
});
//setting up express to use  express-session
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {

        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
//telling express to use flash
app.use(flash());
//telling express to parse all the post requests so that I can access the contents of req.body
app.use(express.urlencoded({ extended: true }));
//telling the app to use passport.initialize and passport.session
app.use(passport.initialize());
app.use(passport.session());
//telling our server to use method override and the query string we want to use is _method
app.use(methodOverride('_method'));
//thi tells passport to use the local strategy and authenticate the user model
passport.use('local', new LocalStrategy(User.authenticate()));
//this tells passport how to store a Userin a session
passport.serializeUser(User.serializeUser());
//this tells passport how to get an User out from a session
passport.deserializeUser(User.deserializeUser());
//using mongoSanitize
app.use(mongoSanitize());

//the underlisted are a list of urls that we want to be accessed by the application,anything not in the list will be rejected
const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",

];
const styleSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",


];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    'https://fonts.googleapis.com/',
    ' https://fonts.gstatic.com/',
    "https://cdn.jsdelivr.net"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dbi5rixx1/",
                "https://img.icons8.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// middleware to enable use flash automatically in the templates without having to pass it through
app.use((req, res, next) => {
    res.locals.currentUser = req.user; //setting our currentUser in all our templates to be equals to req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//setting up the route that the userRoute should be access from
app.use('/', userRoutes);

//setting up the route that the adminRoute should be accessed from
app.use('/admin', adminRoutes);

//setting up the 404 route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


//setting up the error hnadler and the error template tghat is to be rendered
app.use(async (err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, something went wrong'
    res.status(statusCode).render('error', { err });
})


//telling express which port to listen on
app.listen(port, () => {
    console.log("Listening on port 3000")
})

