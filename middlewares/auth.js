const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }
  try {
    const payload = jwt.verify(token, 'secret-key');
    req.user = payload;
    return next();
  } catch (error) {
    throw new UnauthorizedError('Необходима авторизация');
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }
};

module.exports = auth;
