

const jwt = require('jsonwebtoken');
const  {listaNegraService}  = require('../services/listaNegraService')


const validarTokenMiddleware = async (req, res, next) => {
  try {
    if (!req || !req.headers || !req.headers.authorization) {
      return res.status(401).json({ error: 'Acceso no autorizado'  });
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    const tokenEnListaNegra = await listaNegraService.tokenEnListaNegra(token);
    if (tokenEnListaNegra) {
      return res.status(401).json({ error: 'El token está en la lista negra' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token no válido' });
      }
      req.user = decoded;
      
  req.user = decoded;
  req.email = decoded.email
     
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en validarTokenMiddleware' });
  }
};


module.exports = validarTokenMiddleware;
