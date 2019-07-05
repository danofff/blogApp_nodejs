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

// /posts/:post GET single post
router.get('/:post', blogController.getPost);

// /posts/:post/edit GET edit post
router.get('/:post/edit', blogController.getEditPost);

// /posts/:post/edit POST edit post
router.post('/:post/edit', blogController.postEditPost);


module.exports = router;