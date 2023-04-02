const mongoose = require('mongoose');

const Card = require('../models/card');
const {
  DEFAULT_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
  NOT_FOUND_CARD_ERROR_MESSAGE,
  VALIDATION_CARD_CREATE_ERROR_MESSAGE,
  VALIDATION_CARD_LIKE_ERROR_MESSAGE,
  VALIDATION_CARD_ID_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate('owner');
    return res.send(cards);
  } catch (err) {
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .send({ message: VALIDATION_CARD_CREATE_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (card.owner.toString() !== req.user._id) {
      return res.status(403).send({ message: 'Вы не можете удалять карточки других пользователей' });
    }
    if (card === null) {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: NOT_FOUND_CARD_ERROR_MESSAGE });
    }
    return res.send({ message: 'Deleted' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .send({ message: VALIDATION_CARD_ID_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: NOT_FOUND_CARD_ERROR_MESSAGE });
    }
    return res.send(card.likes);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .send({ message: VALIDATION_CARD_LIKE_ERROR_MESSAGE });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(VALIDATION_ERROR_CODE).send({ message: VALIDATION_CARD_ID_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: NOT_FOUND_CARD_ERROR_MESSAGE });
    }
    return res.send(card.likes);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(VALIDATION_ERROR_CODE)
        .send({ message: VALIDATION_CARD_LIKE_ERROR_MESSAGE });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(VALIDATION_ERROR_CODE).send({ message: VALIDATION_CARD_ID_ERROR_MESSAGE });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  }
};
