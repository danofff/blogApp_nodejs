const path = require('path');

const express = require('express');

const themeController = require('../controllers/themeController');

const router = express.Router();

// /theme/add-theme GET
router.get('/add-theme', themeController.getThemeAdd);

// /theme/add-theme POST
router.post('/add-theme', themeController.postThemeAdd);

module.exports = router;