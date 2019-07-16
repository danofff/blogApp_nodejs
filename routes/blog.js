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

// /theme/:theme GET
router.get('/theme/:theme', blogController.getPostsByTheme);

// /author/:author GET
router.get('/author/:author/:authorId', blogController.getPostsByAuthor);

// /posts/:post/comments/addnew
router.post('/:post/comments/addnew', blogController.postAddComment);

// /posts/:post/comments/:comment/delete
router.post('/:post/comments/:comment/delete', blogController.postDeleteComment);

// /posts/:post GET single post
router.get('/:post', blogController.getPost);

// /posts/:post/edit GET edit post
router.get('/:post/edit', blogController.getEditPost);

// /posts/:post/edit POST edit post
router.post('/:post/edit', blogController.postEditPost);

// /posts/:post/delete POST delete post
router.post('/:post/delete', blogController.postDeletePost);


module.exports = router;