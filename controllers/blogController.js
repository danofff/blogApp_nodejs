const Post = require('../models/Post');
const Theme = require('../models/Theme');

exports.getAllPosts = (req, res, next) => {
    Post.find().select('title date preview')
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
    if(req.session.user){
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
    }
    else{
        req.flash('message', 'Для добавления поста необходимо авторизироваться');
        res.redirect('/login');
    }
};

exports.postAddPost = (req, res, next) => {
    const title = req.body.title;
    const theme = req.body.theme;
    let postText = req.body.text;
    const preview = postText.substring(0, postText.indexOf('[cut]'));
    const text = postText.replace('[cut]', '');
    const post = new Post({
       title: title,
       theme: theme,
       preview: preview,
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
                path: '/posts/post',
                post: post
            });
        })
        .catch(error => {
            console.log(error);
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
    const postId = req.params.post;
    const title = req.body.title;
    const theme = req.body.theme;
    let postText = req.body.text;
    const preview = postText.substring(0, postText.indexOf('[cut]'));
    const text = postText.replace('[cut]', '');
    Post.findById(postId).
        then(post => {
            post.title= title;
            post.theme=theme;
            post.preview=preview;
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
        });
}

exports.postDeletePost = (req, res, next) => {
    if(req.session.user){
        const postId = req.params.post;
        Post.deleteOne({_id: postId}, error => {
            if(error){
                console.log(error);
                res.redirect('/posts');
            }
            else{
                res.redirect('/posts')
            }
        });
    }
    else{
        req.flash('message', 'Для удаления поста нужно авторизироваться');
        const returnTo = req.originalUrl.replace('/delete', '');
        res.redirect(returnTo);
    }
}