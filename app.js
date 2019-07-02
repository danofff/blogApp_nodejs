const port = process.env.PORT||3000;

//requires modules
const express = require ("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const blogRoutes = require('./routes/blog');


//require routes
const errorController = require('./controllers/errorController');


//app settings
const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


//app routes
app.use(blogRoutes);
app.use(errorController.get404);


app.listen(port, ()=>{
    console.log('blog app is started!');
});