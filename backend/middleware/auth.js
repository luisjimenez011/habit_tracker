const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Obtiene el token de la cabecera de la petición
  const token = req.header('x-auth-token');

  // Si no hay token, el acceso es denegado
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjunta el objeto de usuario decodificado a la petición
    req.user = decoded.user;
    next(); // Continúa con la siguiente función (la ruta)
  } catch (err) {
    // Si el token no es válido, devuelve un error 401
    res.status(401).json({ msg: 'Token no es válido' });
  }
};

module.exports = auth;