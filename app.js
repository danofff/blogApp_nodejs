//some const
const PORT = process.env.PORT||3000;
const MONGO_DB_URI = process.env.DATABASEURL||'mongodb://localhost:27017/blogapp';

//requires modules
const express = require ("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const sanitizer = require('express-sanitizer');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

//app settings
const app = express();
const store = new mongoDbStore ({
    uri: MONGO_DB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sanitizer());

app.use(session({
    secret: 'this is brand new secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);
app.use(flash());
app.locals.moment = require('moment');



app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//require routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const themeRoutes = require('./routes/theme');
const errorController = require('./controllers/errorController');

//app routes
app.get('/', (req, res, next) => {
    res.redirect('/posts/');
});
app.use(authRoutes);
app.use('/posts/', blogRoutes);
app.use('/theme', themeRoutes);
app.use(errorController.get404);

const User = require('./models/user');
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next()
        })
        .catch(error => {
            console.log(error);
        })
});

mongoose
    .connect(MONGO_DB_URI, {useNewUrlParser: true} )
    .then(result => {
        app.listen(PORT, ()=>{
            console.log('blog app is started');
        }); 
    })
    .catch( err => {
        console.log(err);
    });