const path = require('path');

const express = require('express');

const blogController = require('../controllers/blogController');

const router = express.Router();

// /add-record GET
router.get('/add-post', blogController.getAddPost);


module.exports = router;