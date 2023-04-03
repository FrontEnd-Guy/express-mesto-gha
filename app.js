/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
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

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('*', (req, res) => res.status(NOT_FOUND_ERROR_CODE).send({ message: '404. Такой страницы не существует.' }));

app.listen(PORT, () => console.log('Listening...'));
