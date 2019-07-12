const path = require('path');

const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

// /signup GET signup form
router.get('/signup', authController.getSignup);

// /signup POST register a new user
router.post('/signup', authController.postSignup);

// /login GET login form
router.get('/login', authController.getLogin);

// /login POST login user
router.post('/login', authController.postLogin);

// /logout POST logout user
router.post('/logout', authController.postLogout);

// /reset GET get reset form
router.get('/reset', authController.getReset);

// /reset POST send mail with reset token
router.post('/reset', authController.postReset);

// /new-password/:token GET new password form
router.get('/new-password/:token', authController.getNewPassword);

// /new-password/ POST save a new password
router.post('/new-password', authController.postNewPassword);

module.exports = router;