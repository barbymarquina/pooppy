var jwt = require('jwt-simple'); // libreria de encriptacion para generar token
var moment = require('moment'); // para tratar fechas de modo más amigable
var secret = 'clave_secreta_curso'; // clave que se usa en el algoritmo de encriptación

// generar token exclusivo y asociado a cada usuario
createToken = function(user){
    // parámetros que vamos a utilizar para generar el token
    // normalmente solo necesitaríamos el id de usuario referente al user
    var payload = {
        sub: user._id,
        iat: moment().unix(), // fecha de creación del token, en timestamp en formato unix
        exp: moment().add(7, 'days').unix(), // tiempo de expiración del token
    };

   
    return jwt.encode(payload, secret)
};

module.exports = {
    createToken
}

