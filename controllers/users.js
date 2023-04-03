const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const {
  NOT_FOUND_USER_ERROR_MESSAGE,
  VALIDATION_USER_CREATE_ERROR_MESSAGE,
  VALIDATION_USER_INFO_ERROR_MESSAGE,
  VALIDATION_USER_AVATAR_ERROR_MESSAGE,
  VALIDATION_USER_ID_ERROR_MESSAGE,
  AUTH_ERROR_MESSAGE,
} = require('../utils/constants');

const {
  ConflictError,
  InvalidError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError(AUTH_ERROR_MESSAGE);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError(AUTH_ERROR_MESSAGE);
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Успешный вход в систему' });
  } catch (error) {
    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Пользователь с указанным email уже существует');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    return res.send(user.select('-password'));
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new InvalidError(VALIDATION_USER_CREATE_ERROR_MESSAGE);
    }
    if (err.code === 11000) {
      next();
    }
    return next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user === null) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR_MESSAGE);
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      throw new InvalidError(VALIDATION_USER_ID_ERROR_MESSAGE);
    }
    return next(err);
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
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
      throw new InvalidError(VALIDATION_USER_INFO_ERROR_MESSAGE);
    }
    if (err instanceof mongoose.Error.CastError) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR_MESSAGE);
    }
    return next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
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
      throw new InvalidError(VALIDATION_USER_AVATAR_ERROR_MESSAGE);
    }
    if (err instanceof mongoose.Error.CastError) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR_MESSAGE);
    }
    return next(err);
  }
};
