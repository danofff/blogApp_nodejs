const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const nodemailerTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const variables = (require('../variables'));
const apikey = variables.sendgridkey();

const transporter = nodemailer.createTransport(nodemailerTransport({
    auth: {
      api_key: apikey
    }
  }));

exports.getSignup = (req, res, next) => {
  let message = req.flash('message');
  message = message.length>0? message: null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Регистрация',
    message: message
  });
};

exports.postSignup = (req, res, next) => {
  const login = req.body.login;
  const email = req. body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const role = 'blogger';

  User.findOne({login: login})
    .then(user => {
      if(user){
        req.flash('message', 'Пользователь с таким логином уже существует');
        return res.redirect('/signup');
      }
      if(password!==confirmPassword){
        req.flash('message', 'Пароли не совпадают');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            login: login,
            email: email,
            password: hashedPassword,
            role: role
          });
          return newUser.save();
        });
    })
    .then(result => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'noreply@freethoughts.com',
        subject: 'Регистрация аккаунта',
        html: `
         <h3> Вы успешно зарегистрированный на сайте freethoughts.com</h3>
        `
      })
      .catch(error => {
        console.log(error);
        res.redirect('/');
      });
    })
    .catch(error => {
      console.log(error);
      res.redirect('/signup');
    });
};

exports.getLogin = (req, res, next) => {
  let message = req.flash('message');
  message = message.length>0? message: null;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Вход',
    message: message
  });
};

exports.postLogin = (req, res, next) => {
  const login = req.body.login;
  const password = req.body.password;
  User.findOne({login: login})
    .then(user => {
      if(!user){
        req.flash('message', 'Неправильный логин');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(error => {
            if(error){
              console.log(error);
            }
            res.redirect('/posts');
        });
        }
        req.flash('message', 'Неправильный пароль');
        res.redirect('/login');
      })
      .catch(error => {
        console.log(error);
        res.redirect('/login');
      })
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(error => {
    if(error){
      console.log(error);
    }
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('message');
  message = message.length>0? message: null;
  res.render('auth/reset', {
    path: '/signup',
    title: 'Сбросить пароль',
    message: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if(error){
      console.log(error);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    const login = req.body.login;
    const email = req.body.email;

    User.findOne({login: login, email: email})
      .then(user => {
        if(!user){
          req.flash('message', 'Нет пользователя с таким логином и почтой');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save()
          .then(result => {
            res.redirect('/');
            transporter.sendMail({
              to: req.body.email,
              from: 'noreply@freethoughts.com',
              subject: 'Восстановление пароля',
              html: `
              <h3>Восстановление доступа к Free Toughts</h3>
              <p>Для восcтановления пораля кликните по ссылке ниже</p>
              <a href="http://localhost:3000/new-password/${token}">Восстановить пароль</a>
              <p>Если вы не запрашиали восстановление пароля, просто проигнорируйте это письмо</p>
              `
            });
          });
      })
      .catch(error => {
        console.log(error);
        res.redirect('/reset');
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
      let message = req.flash('message');
      message = message.length>0? message: null;
      if(user){
        res.render('auth/newPassword', {
          path: '/new-password',
          pageTitle: 'Новый пароль',
          userId: user._id.toString(),
          passwordToken: token,
          message: message
        });
      }
      else{
        req.flash('message', 'Время восстановления пароля вышло');
        res.redirect('/reset');
      }
    })
    .catch(error => {
      console.log(error);
      res.redirect('/reset');
    })
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  if(newPassword!==confirmPassword){
    req.flash('message', 'Пароли не совпадают');
    return res.redirect('/new-password/' + passwordToken)
  }

  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
  })
  .then(user => {
    if(!user){
      req.flash('message', 'Невозможно изменить пароль, попробуйте заново');
      return res.redirect('/reset');
    }
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(error => {
    console.log(error);
    res.redirect('/reset');
  });
};