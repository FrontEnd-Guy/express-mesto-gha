const router = require('express').Router();

const {
  getCurrentUser, getUsers, getUser, updateUserInfo, updateAvatar,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');

router.get('/', auth, getUsers);

router.get('/me', auth, getCurrentUser);

router.get('/:userId', auth, getUser);

router.patch('/me', auth, updateUserInfo);

router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
