const mongoose = require('mongoose');

const Card = require('../models/card');
const {
  NOT_FOUND_CARD_ERROR_MESSAGE,
  VALIDATION_CARD_CREATE_ERROR_MESSAGE,
  VALIDATION_CARD_LIKE_ERROR_MESSAGE,
  VALIDATION_CARD_ID_ERROR_MESSAGE,
} = require('../utils/constants');

const {
  InvalidError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate('owner');
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new InvalidError(VALIDATION_CARD_CREATE_ERROR_MESSAGE);
    }
    return next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError(NOT_FOUND_CARD_ERROR_MESSAGE);
    }
    if (card.owner.toString() !== req.user._id) {
      throw new UnauthorizedError('Вы не можете удалять карточки других пользователей');
    }
    await card.remove();
    return res.send({ message: 'Deleted' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      throw new InvalidError(VALIDATION_CARD_ID_ERROR_MESSAGE);
    }
    return next(err);
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
      throw new NotFoundError(NOT_FOUND_CARD_ERROR_MESSAGE);
    }
    return res.send(card.likes);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new InvalidError(VALIDATION_CARD_LIKE_ERROR_MESSAGE);
    }
    if (err instanceof mongoose.Error.CastError) {
      throw new InvalidError(VALIDATION_CARD_ID_ERROR_MESSAGE);
    }
    return next(err);
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
      throw new NotFoundError(NOT_FOUND_CARD_ERROR_MESSAGE);
    }
    return res.send(card.likes);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new InvalidError(VALIDATION_CARD_LIKE_ERROR_MESSAGE);
    }
    if (err instanceof mongoose.Error.CastError) {
      throw new InvalidError(VALIDATION_CARD_ID_ERROR_MESSAGE);
    }
    return next(err);
  }
};
