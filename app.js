/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');

const app = express();
const PORT = 3000;

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Connected'))
  .catch((error) => console.log(`Error during connection ${error}`));

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '641290ddc944e7a4acfd4151',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(NOT_FOUND_ERROR_CODE).send({ message: '404. Такой страницы не существует.' }));

app.listen(PORT, () => console.log('Listening...'));
