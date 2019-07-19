const Post = require('../models/Post');
const Theme = require('../models/Theme');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getAllPosts = (req, res, next) => {
    let message = req.flash('message');
    message = message.length>0? message: null;
    Post.find({}, 'title date preview author rate watched favorite')
        .populate('theme')
        .then(posts => {
            res.render('blog/allPosts', {
                pageTitle: 'Все посты',
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
                pageTitle: 'Добавить пост',
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
       comments: [],
       ratedUsers:[],
       rate: 0,
       watched: 0,
       favorite: 0
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
                pageTitle: 'Посты по теме',
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
                pageTitle: `Посты автора ${username}`,
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
            post.watched++;
            post.save();
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
                            pageTitle: `Редактирование ${post.title}`,
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
    Post.findById(postId)
        .then(post => {
            post.title= title;
            post.theme=theme;
            post.preview=preview;
            post.text=text;
            post.save();
            res.redirect(`/posts/${postId}`);
        })
        .catch(error => {
            console.log(error);
            res.redirect('/posts');
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

exports.getMyPosts = (req, res, next) =>{
    if(!req.session.user){
        req.flash('message', 'Для выполнения запроса нужно авторизироваться');
        return res.redirect('/posts');
    }
    const authorId = mongoose.Types.ObjectId(req.session.user._id);
    const username = req.session.user.login;
    const author = {
        id: authorId,
        username: username
    };
    Post.find({author: author})
        .populate('theme')
        .then(posts => {
            res.render('blog/allPosts', {
                pageTitle: `Посты ${username}`,
                path: '/posts/myposts',
                posts: posts
            });
        })
        .catch(err => {
            console.log(err);
            redirect('/error');
        });
}

exports.postAddRatePost = (req, res, next) => {
    if(!req.session.user){
        return res.status(500).send('Для голосования нужно авторизироваться');
    }
    const postId = req.params.post;
    Post.findById(postId)
        .then(post => {
            if(!post){
                res.status(500).send('Нет такого поста');
            }
            if(post.ratedUsers.includes(req.session.user._id.toString())){
                return res.status(500).send('Нельзя проголосовать дважды');
            }
            let rate = req.body.rateHandler;
            if(rate ==='plus'){
                post.rate++;
            }
            else if(rate==='minus'){
                post.rate--;
            }
            else {
                return res.status(500).send('Ошибка при проголосовании');
            }
            post.ratedUsers.push(req.session.user._id.toString());
            post.save();
            res.status(200).send(post.rate.toString());
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send('Ошибка при проголосовании');
        })
}

exports.postAddToFavorite =(req, res, next) => {
    if(!req.session.user){
        return res.status(500).send('Для добавления в избранное нужно авторизироваться');
    }
    const postId = mongoose.Types.ObjectId(req.params.post);
    const userId = req.session.user._id; 
    User.findById(userId)
        .then(user => {
            if(user.favoritePosts.includes(postId)){
                return res.status(500).send('Данный пост уже в ваших избранных');
            }
            user.favoritePosts.push(mongoose.Types.ObjectId(postId));
            user.save();
            res.status(200).send('Пост успешно доблавлен в избранные');
            Post.findById(postId)
                .then(post => {
                    post.favorite++;
                    post.save();
                });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Нельзя добавить пост в избранное');
        })
}

exports.getFavoritePosts = (req, res, next) => {
    if(!req.session.user){
        req.flash('message', 'Для просмотра избранных постов нужно авторизироваться');
        return res.redirect('back');
    }
    User.findById(req.session.user._id)
        .then(user => {
            Post.find({
                '_id': user.favoritePosts
            })
            .populate('theme')
            .then(findedPosts => {
                res.render('blog/allPosts', {
                    pageTitle: 'Избранные посты',
                    path: '/posts/favorite',
                    posts: findedPosts
                })
            })
        })
        .catch(error => {
            console.log(error);
            res.redirect('back');
        })

}

exports.postDeleteFromFavorite = (req, res, next) => {
    if(!req.session.user){
        req.flash('message', 'Для просмотра избранных постов нужно авторизироваться');
        return res.redirect('back');
    }
    User.findById(req.session.user._id)
        .then(user => {
            const postId = mongoose.Types.ObjectId(req.params.post);
            const elementIndex=user.favoritePosts.indexOf(postId);
            if (elementIndex !==-1){
                user.favoritePosts.splice(elementIndex);
                user.save();
                res.redirect('back');
                Post.findById(postId)
                    .then(post => {
                        post.favorite--;
                        post.save();
                    })
            }
            else {
                req.flash('message', 'Нет такого поста в ваших избранных');
            }
        })
        .catch(error => {
            console.log(error);
            req.flash('message', 'Что-то пошло не так');
            res.redirect('back');
        });
}