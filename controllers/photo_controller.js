var fs = require('fs');
var models = require('./../models');

// Devuelve una lista de las imagenes disponibles y sus metadatos
exports.list = function (req, res, next) {
	models.Photo.findAll().then(function(photos){
		res.render('photos/index', {photos: photos});
	}).catch(function(error) {
		next(error);
	});
};

// Devuelve la vista del formulario para subir una nueva foto
exports.new = function (req, res) {
	res.render('photos/new');
};

// Devuelve la vista de visualización de una foto.
// El campo photo.url contiene la url donde se encuentra el fichero de imagen
exports.show = function (req, res, next) {
	console.log(req.params.photoId)
	models.Photo.findById(req.params.photoId).then(function(photo) {
		photo.getAuthor().then(function(user) {
			author = user && user.username || 'Anónimo'
			photo.id = req.params.photoId;
			res.render("photos/show", {photo: photo, author: author });
		}).catch(function(error) {
			next(error);
		});
	}).catch(function(error) {
		next(error);
	}); 
};

// Escribe una nueva foto en el registro de imagenes.
exports.create = function (req, res) {
	var authorId = req.session.user && req.session.user.id || 0;

	var photo = models.Photo.build({name: req.body.name, 
									url: req.body.url,
									AuthorId: authorId } );
	console.log('Nuevo fichero: ', req.body);
	return photo.save({fields: ['name', 'url', 'AuthorId']}).then(function() {
		models.User.findById(authorId).then(function(user) {
			user.addPhoto(photo)
			res.redirect('/photos');
		}).catch(function() {
			res.redirect('/photos');
		})
	});
};

// Borra una foto (photoId) del registro de imagenes 
exports.destroy = function (req, res, next) {
	models.Photo.findById(req.params.photoId).then(function(photo) {
		photo.destroy().then(function() {
			res.redirect('/photos');
		});
	}).catch(function(error) {
		next(error);
	});
};