/* eslint-disable consistent-return */
const mongoose = require('mongoose');

const Card = require('../models/card');
const {
  NOT_FOUND_CARD_ERROR_MESSAGE,
  VALIDATION_CARD_CREATE_ERROR_MESSAGE,
  VALIDATION_CARD_ID_ERROR_MESSAGE,
} = require('../utils/constants');

const {
  InvalidError,
  NotFoundError,
  ForbiddenError,
} = require('../errors');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({})
      .populate('owner')
      .populate('likes');
    return res.send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(201).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new InvalidError(VALIDATION_CARD_CREATE_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(new NotFoundError(NOT_FOUND_CARD_ERROR_MESSAGE));
    } else if (card.owner.toString() !== req.user._id) {
      next(new ForbiddenError('Вы не можете удалять карточки других пользователей'));
    } else {
      await Card.deleteOne({ _id: req.params.cardId });
      return res.send({ message: 'Deleted' });
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new InvalidError(VALIDATION_CARD_ID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (card === null) {
      next(new NotFoundError(NOT_FOUND_CARD_ERROR_MESSAGE));
    } else {
      return res.send(card.likes);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new InvalidError(VALIDATION_CARD_ID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (card === null) {
      next(new NotFoundError(NOT_FOUND_CARD_ERROR_MESSAGE));
    } else {
      return res.send(card.likes);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new InvalidError(VALIDATION_CARD_ID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};
