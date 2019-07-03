const path = require('path');

const express = require('express');

const themeController = require('../controllers/themeController');

const router = express.Router();

router.get('/add-theme', themeController.getThemeAdd);
router.post('/add-theme', themeController.postThemeAdd);

module.exports = router;