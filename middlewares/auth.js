const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
};
