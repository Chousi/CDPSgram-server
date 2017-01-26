var models = require('../models');
var Sequelize = require('sequelize');

// GET /users
exports.index = function(req, res, next) {
    models.User.findAll({ order: ['username'] })
    .then(function(users) {
        res.render('users/index', { users: users });
    }).catch(function(error) {
        next(error);
    });
};

// GET /users/:id
exports.show = function(req, res, next) {
    models.User.findById(req.params.userId).then(function(user) {
        user.getPhotos().then(function(photos) {
            res.render('users/show', { user: user, photos: photos});
        });
        })
    .catch(function(error) {
        next(error);
    });
};

// GET /users/new
exports.new = function(req, res, next) {
    var user = models.User.build({ username: '', password: '' });
    res.render('users/new', { user: user });
};

// POST /users
exports.create = function(req, res, next) {
    
    var user = models.User.build({ username: req.body.username,
                                   password: req.body.password });

    // El login debe ser único:
    models.User.find({ where: { username: req.body.username }}).then(function(existing_user) {
        if(existing_user) {
            var emsg = 'El usuario \"' + req.body.username + '\" ya exite.';
            res.render('users/new', { user: user });
        } else {
            // Guardar en la BBDD
            return user.save({ fields: [ 'username', 'password', 'salt' ]}).then(function(user) {  // Renderiza página de usuarios
                res.redirect('/users/' + user.id);
            }).catch(Sequelize.ValidationError, function(error) {
                res.render('users/new', { user: user });
            });
        }
    }).catch(function(error) {
        next(error);
    });
};

// GET /users/:id/edit
exports.edit = function(req, res, next) {
    models.User.findById(req.params.userId).then(function(user) {
        res.render('users/edit', { user: user });
    }).catch(function(error) {
        next(error);
    });
};

// PUT /users/:id
exports.update = function(req, res, next) {
    models.User.findById(req.params.userId).then(function(user) {
        user.password = req.body.password;

        if(!req.body.password) {
            return res.render('users/edit', { user: user });
        }

        user.save({ fields: ["password", "salt" ]}).then(function(user) {
            res.redirect('/users');
        }).catch(Sequelize.ValidationError, function(error) {
            res.render('users/edit', { user: user });
        }).catch(function(error) {
            next(error);
        });
    }).catch(function(error) {
        next(error);
    });
};

// DELETE /users/:id
exports.destroy = function(req, res, next)  {
    models.User.findById(req.params.userId).then(function(user) {
        user.destroy().then(function() {
            user.getPhotos().then(function(photos) {
                for (var photo in photos) {
                    photos[photo].AuthorId = 0;
                    photos[photo].save({fields: ['AuthorId']});
                }
                // Borrando usuario logueado
                if (req.session.user && req.session.user.id === user.id) {
                delete req.session.user
                }
                res.redirect('/')
            }).catch(function(error) {
                next(error);
            });
        });
    }).catch(function(error) {
        next(error);
    });    
};