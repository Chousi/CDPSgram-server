
var path = require('path')

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
//    DATABASE_URL = sqlite:///
//    DATABASE_STORAGE = cdps.sqlite
// Usar BBDD Postgres:
//    DATABASE_URL = postgres://user:passwd@host:port/database

var url, storage;

if (!process.env.DATABASE_URL) {
	url = "sqlite:///"
	storage = "cdps.sqlite";
} else {
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || '';
}

var sequelize = new Sequelize(url,
							 {storage: storage, 
							  omitNull: true
							 });


// Importar la definición de las tablas
var Photo = sequelize.import(path.join(__dirname,'photo')); // Importar la tabla Photo de photo.js
var User = sequelize.import(path.join(__dirname,'user')); //Importar la tabla User de user.js

// Relación 1 a N entre User y Photo
User.hasMany(Photo, {foreignKey: 'AuthorId'});
Photo.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

// Exportar la definición de las tablas
exports.Photo = Photo;		// Exportar la tabla Photo
exports.User = User;		// Exportar la tabla User