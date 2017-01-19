var express = require('express');
var router = express.Router();

var multer  = require('multer');

var photos_dir = process.env.PHOTOS_DIR || './media/';

var photoController = require('../controllers/photo_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page */
router.get('/', function(req, res) {
  res.render('index');
});

// Rutas para la gestión de las fotos
router.get('/photos', 								photoController.list);
router.get('/photos/new', 							photoController.new);
router.get('/photos/:photoId', 						photoController.show);
router.post('/photos', multer({inMemory: true}), 	photoController.create);
router.delete('/photos/:photoId', 					photoController.destroy);

// Rutas para la gestión de los usuarios
router.get('/users', 								userController.index);	// Listado de usuarios
router.get('/users/:userId(\\d+)', 					userController.show); //Ver un usuario
router.get('/users/new',							userController.new); // Formulario sign in
router.get('/users/:userId(\\d+)/edit',				userController.edit); // Editar cuenta
router.post('/users',								userController.create); // Registrar a un usuario
router.put('/users/:userId(\\d+)',					userController.update); // Actualizar cuenta
router.delete('/users/:userId(\\d+)',				userController.destroy); // Borrar cuenta

// Rutas para la gestión de sesiones
router.get('/session',								sessionController.new) // Formulario login
router.post('/session',								sessionController.create) // Crear sesión
router.delete('/session',							sessionController.destroy) // Destruir sesión

module.exports = router;