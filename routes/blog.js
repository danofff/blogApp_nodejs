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
router.get('/:post', blogController.getPost)


module.exports = router;