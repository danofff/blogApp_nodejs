const Post = require('../models/Post');
const Theme = require('../models/Theme');

exports.getAllPosts = (req, res, next) => {
    Post.find()
        .populate('theme')
        .then(posts => {
            res.render('blog/allPosts', {
                pageTitle: 'All posts',
                path: '/posts',
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
                path: '/posts/add-post',
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
            res.redirect('/error')
        })
}

exports.getPostsByTheme = (req, res, next) => {
    const themeId = req.params.theme;

    Post.find({theme:themeId})
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

exports.getPost = (req, res, next) => {
    const postId = req.params.post;
    Post.findById(postId)
        .populate('theme')
        .then(post => {
            res.render('blog/singlePost', {
                pageTitle: post.title,
                path: '/',
                post: post
            });
        })
        .catch(error => {
            console.log(err);
            redirect('/error');
        });
}
exports.getEditPost = (req, res, next) => {
    const postId = req.params.post;
    Post.findById(postId)
        .populate('theme')
        .then(post => {
            Theme.find()
            .then(themes => {
                res.render('blog/editPost', {
                    pageTitle: `Edit ${post.title}`,
                    path: `/posts/edit`,
                    post: post, 
                    themes: themes
                });
            })
            .catch(err => {
                console.log(error);
                res.redirect('/');
            });
            })
        .catch(error => {
            console.log(error);
            res.redirect(`/posts/${post._id}`);
        });
}

exports.postEditPost = (req, res, next) =>{
    const postId = req.body.postId;
    const title = req.body.title;
    const theme = req.body.theme;
    const text = req.body.text;
    Post.findById(postId).
        then(post => {
            post.title= title;
            post.theme=theme;
            post.text=text;
            post.save();
            res.render('blog/singlePost', {
                pageTitle: post.title,
                path: '/',
                post: post
            });
        })
        .catch(error => {
            console.log(error);
            res.render('blog/singlePost', {
                pageTitle: post.title,
                path: '/',
                post: post
            });
        })

}