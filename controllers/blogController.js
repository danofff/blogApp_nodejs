const Post = require('../models/Post');
const Theme = require('../models/Theme');

exports.getAllPosts = (req, res, next) => {
    Post.find()
        .populate('theme')
        .then(posts => {
            res.render('blog/allPosts', {
                pageTitle: 'All posts',
                path: '/',
                posts: posts
            });
        })
        .catch(err => {
            console.log(err);
            redirect('/error');
        });
}

exports.getAddPost = (req, res, next) => {
    Theme.find()
        .then(themes => {
            res.render('blog/addPost', {
                pageTitle: 'Add Post',
                path: '/add-post',
                themes: themes
            });
        })
        .catch(err => {
            console.log(error);
            res.redirect('/');
        });
};

exports.postAddPost = (req, res, next) => {
    const title = req.body.title;
    const theme = req.body.theme;
    const text = req.body.text;
    const post = new Post({
       title: title,
       theme: theme,
       text: text 
    });
    post.save()
        .then(result => {
            console.log('created post');
            res.redirect('/');
        })
        .catch(err =>{
            console.log(err);
        })
}