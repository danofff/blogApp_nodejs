const Theme = require('../models/Theme');
const Post = require('../models/Post')

exports.getThemeAdd = (req, res, next) => {
    res.render('theme/addTheme.pug', {
        pageTitle: 'Add theme',
        path: '/theme/add-theme'
    });
}

exports.postThemeAdd = (req, res, next) => {
    const themeName = req.body.themeName;
    const theme = new Theme ({
        themeName: themeName
    });
    theme.save()
        .then(result => {
            console.log('theme added');
            res.redirect('/');
        })
        .catch(error => {
            console.log(error);
            res.redirect('/error');
        });
}
