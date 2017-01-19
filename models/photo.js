/* 

Modelo de datos de canciones (photo)

photo_id: {
	name: nombre de la canción,
	url: url del fichero de audio
} 

*/

module.exports = function(sequelize, Datatypes) {
	return sequelize.define(
		'Photos',
		{
			name: Datatypes.STRING,
			url: Datatypes.STRING
		}
	);
};