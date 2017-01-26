
var models = require('../models');
var Sequelize = require('sequelize');

/* Autenticar a un usuario si el usuario está en la tabla Users
*
* Devuelve Promesa: busca usuario con login y password
*  - autenticación ok, devuelve un objeto User con then(..)
*  - autenticación falla, promesa satisfecha pero devuelve null
*/
var authenticate = function(login, password) {
	return models.User.findOne({where: {username: login }})
		.then(function(user) {
			if (user && user.verifyPassword(password)) {
				return user;
			} else {
				return null;
			}
		});
};

// GET /session -- Formulario de login
exports.new = function(req, res, next) {
	res.render('session/new', { redir: req.query.redir || '/'});
};

// POST /session --Crear sesion si usuario ok
exports.create = function(req,res,next) {
	var redir 	 = req.body.redir || '/';
	var login 	 = req.body.login;
	var password = req.body.password;

	authenticate(login, password)
		.then(function(user) {
			if (user) {
				// Crear req.session.user y guardar campos id y username
				// La sesión se define por la existencia de: req.session.user
				req.session.user = {id:user.id, username:user.username, isAdmin:user.isAdmin, lastPetition: new Date()};

				res.redirect("/"); // redirección a la raíz
			} else {
				req.flash('error','La autenticación ha fallado. Intentelo otra vez');
				res.redirect("/session"); // redirección a login
			}
		})
		.catch(function(error) {
			req.flash('error', 'Se ha producido un error: ' + error);
			next(error);
		});
};
// DELETE /session -- Destruir sesion
exports.destroy = function(req, res, next) {
	delete req.session.user;
	res.redirect('/session'); // redirección a login
};




