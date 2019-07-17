const Post = require('../models/Post');
const Theme = require('../models/Theme');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

exports.getAllPosts = (req, res, next) => {
    Post.find({}, 'title date preview author')
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
    const author = {
        id: req.session.user._id,
        username: req.session.user.login
    };
    const post = new Post({
       title: title,
       theme: theme,
       preview: preview,
       text: text,
       author: author,
       comments: []
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
exports.getPostsByAuthor = (req, res, next) => {
    const authorId = mongoose.Types.ObjectId(req.params.authorId);
    const username = req.params.author;
    const author = {
        id: authorId,
        username: username
    };
    Post.find({author: author})
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
    let message = req.flash('message');
    message = message.length>0? message: null;
    const postId = req.params.post;
    Post.findById(postId)
        .populate('theme')
        .populate('comments')
        .then(post => {
            res.render('blog/singlePost', {
                pageTitle: post.title,
                path: '/posts/post',
                post: post,
                message: message
            });
        })
        .catch(error => {
            console.log(error);
            res.redirect('/error');
        });
}
exports.getEditPost = (req, res, next) => {
    if(req.session.user){
        const postId = req.params.post;
        Post.findById(postId)
            .populate('theme')
            .then(post => {
                if(post.author.id.equals(req.session.user._id)||req.session.user.role==='admin'){
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
                }
                else{
                    req.flash('message', 'Вы не можете редактировать этот пост');
                    const returnTo = req.originalUrl.replace('/edit', '');
                    res.redirect(returnTo);
                }
                })
            .catch(error => {
                console.log(error);
                res.redirect(`/posts/${post._id}`);
            });
    }
    else{
        req.flash('message', 'Для редактирования поста вы должны авторизироваться');
        const returnTo = req.originalUrl.replace('/edit', '');
        res.redirect(returnTo);
    }
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
    else {
        req.flash('message', 'Для удаления поста нужно авторизироваться');
        const returnTo = req.originalUrl.replace('/delete', '');
        res.redirect(returnTo);
    }
}


//response is a json
exports.postAddComment = (req, res, next) => {
    const postId = req.params.post
    if(!req.session.user){
        req.flash('message', 'Для добавления комментария нужно авторизировться');
        return res.redirect(`/posts/${postId}`);
    }

    Post.findById(postId)
     .then(post => {
         if(post){
             const commentText = req.body.commentText;
             const commentAuthorId = req.session.user._id;
             const commentAuthorUsername = req.session.user.login;
             const newComment = new Comment ({
                 text: commentText,
                 author:{
                     id: commentAuthorId,
                     username: commentAuthorUsername
                 }
             });
             newComment.save()
                .then(result => {
                    post.comments.push(newComment);
                    post.save()
                        .then(result => {
                            res.render('partials/comment', {layout:false, comment:newComment, postId: postId});
                        });                   
                });
         }
         else {
             res.sendStatus(500);
         }
     })
     .catch(error => {
         console.log(error);
         res.sendStatus(500);
     });
}

exports.postDeleteComment = (req, res, next) => {
    const authorId = req.body.author;
    const postId = req.params.post;

    if(!req.session.user.role==='admin'){
        req.flash('message', 'Вы не можете удалить этот комментарий');
        return res.redirect(`/posts/${postId}`)
    }
    else if(!req.session.user._id.equals(authorId)) {
        req.flash('message', 'Вы не можете удалить этот комментарий');
        return res.redirect(`/posts/${postId}`)
    }
     const commentId = req.params.comment;
     Comment.findByIdAndRemove(commentId)
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            res.redirect('back');
        })
}

exports.postEditComment = (req, res, next) => {
    const authorId = req.body.author;
    const postId = req.params.post;
    const commentId = req.params.comment;
    Comment.findById(commentId)
        .then(comment => {
            comment.text = req.body.editedComment;
            comment.date = Date.now();
            comment.save();
            res.send(comment.text);
        })
        .catch(error => {
            res.sendStatus(500);
        });
}