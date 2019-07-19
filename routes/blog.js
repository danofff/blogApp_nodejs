const path = require('path');

const express = require('express');

const blogController = require('../controllers/blogController');

const router = express.Router();

// / -show all posts
router.get('/', blogController.getAllPosts);

// /add-post GET
router.get('/add-post', blogController.getAddPost);

// /add-post POST
router.post('/add-post', blogController.postAddPost);

// /posts/myposts GET user posts
router.get('/myposts', blogController.getMyPosts);

// /posts/favorite GET favorite posts
router.get('/favorite', blogController.getFavoritePosts);

//  /favorite/delete/:post POST delete post from favorite
router.post('/favorite/delete/:post', blogController.postDeleteFromFavorite);

// /theme/:theme GET
router.get('/theme/:theme', blogController.getPostsByTheme);

// /author/:author GET posts by author
router.get('/author/:author/:authorId', blogController.getPostsByAuthor);

// /:post/vote POST add rate to post
router.post('/:post/vote', blogController.postAddRatePost);

// /:post/favorite POST add post to favorite posts
router.post('/:post/favorite', blogController.postAddToFavorite);

// /posts/:post/comments/addnew
router.post('/:post/comments/addnew', blogController.postAddComment);

// /posts/:post/comments/:comment/delete
router.post('/:post/comments/:comment/delete', blogController.postDeleteComment);

// /posts/:post/comments/:comment/edit
router.post('/:post/comments/:comment/edit', blogController.postEditComment);

// /posts/:post GET single post
router.get('/:post', blogController.getPost);

// /posts/:post/edit GET edit post
router.get('/:post/edit', blogController.getEditPost);

// /posts/:post/edit POST edit post
router.post('/:post/edit', blogController.postEditPost);

// /posts/:post/delete POST delete post
router.post('/:post/delete', blogController.postDeletePost);

module.exports = router;