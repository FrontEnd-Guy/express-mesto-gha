const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', auth, getCards);

router.post('/', auth, createCard);

router.delete('/:cardId', auth, deleteCard);

router.put('/:cardId/likes', auth, likeCard);

router.delete('/:cardId/likes', auth, dislikeCard);

module.exports = router;
