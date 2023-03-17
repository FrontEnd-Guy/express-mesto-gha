const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');

const app = express();
const PORT = 3006;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Connected'))
  .catch((error) => console.log(`Error during connection ${error}`));

app.use(bodyParser.json());

app.use('/users', userRouter);
app.use(express.static(path.join(__dirname, './public')));

app.listen(PORT, () => console.log('OKK'));
