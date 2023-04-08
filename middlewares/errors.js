/* eslint-disable no-unused-vars */
module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
};
