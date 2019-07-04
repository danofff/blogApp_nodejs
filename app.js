const port = process.env.PORT||3000;

//requires modules
const express = require ("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const sanitizer = require('express-sanitizer');

//require routes
const blogRoutes = require('./routes/blog');
const themeRoutes = require('./routes/theme');
const errorController = require('./controllers/errorController');


//app settings
const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sanitizer());
app.locals.moment = require('moment');


//app routes
app.get('/', (req, res, next) => {
    res.redirect('/posts/');
});
app.use('/posts/', blogRoutes);
app.use('/theme', themeRoutes);
app.use(errorController.get404);

mongoose
    .connect('mongodb://localhost:27017/blogapp', {useNewUrlParser: true} )
    .then(result => {
        app.listen(port, ()=>{
            console.log('blog app is started');
        }); 
    })
    .catch( err => {
        console.log(err);
    });