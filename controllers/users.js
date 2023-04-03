const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const {
  DEFAULT_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  NOT_FOUND_USER_ERROR_MESSAGE,
  VALIDATION_USER_CREATE_ERROR_MESSAGE,
  VALIDATION_USER_INFO_ERROR_MESSAGE,
  VALIDATION_USER_AVATAR_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  VALIDATION_USER_ID_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user === null) {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: NOT_FOUND_USER_ERROR_MESSAGE });
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(VALIDATION_ERROR_CODE).send({ message: VALIDATION_USER_ID_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .send({ message: VALIDATION_USER_CREATE_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports.updateUserInfo = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .send({ message: VALIDATION_USER_INFO_ERROR_MESSAGE });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_USER_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .send({ message: VALIDATION_USER_AVATAR_ERROR_MESSAGE });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_USER_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};
