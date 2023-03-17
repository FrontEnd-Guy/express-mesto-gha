const mongoose = require('mongoose');
const User = require('../models/user');
const {
  NOT_FOUND_USER_ERROR_MESSAGE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
  VALIDATION_ERROR_CODE,
  VALIDATION_ERROR_MESSAGE,
} = require('../utils/constants');

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
    const { userId } = req.params;
    const user = await User.findById(userId);
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_USER_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(VALIDATION_ERROR_CODE).send({ message: VALIDATION_ERROR_MESSAGE });
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
      return res.status(VALIDATION_ERROR_CODE).send({ message: VALIDATION_ERROR_MESSAGE });
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
      return res.status(VALIDATION_ERROR_CODE).send({ message: VALIDATION_ERROR_MESSAGE });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_USER_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};
