exports.getAddPost = (req, res, next) => {
    res.render('blog/addPost', {
        pageTitle: 'Add Post',
        path: '/add-post'
    });
};