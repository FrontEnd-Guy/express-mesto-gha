/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');
const { handleError } = require('./middlewares/errors');

const app = express();
const PORT = 3000;

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Connected'))
  .catch((error) => console.log(`Error during connection ${error}`));

app.use(bodyParser.json());

const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}[-a-zA-Z0-9@:%_+.~#?&//=]*$/;

const userCreateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const userLoginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

app.post('/signup', userCreateValidation, createUser);
app.post('/signin', userLoginValidation, login);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res) => res.status(NOT_FOUND_ERROR_CODE).send({ message: '404. Такой страницы не существует.' }));

app.use(handleError);

app.listen(PORT, () => console.log('Listening...'));
