const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCurrentUser, getUsers, getUser, updateUserInfo, updateAvatar,
} = require('../controllers/users');

router.get('/', auth, getUsers);

router.get('/me', auth, getCurrentUser);

router.get('/:userId', auth, getUser);

router.patch('/me', auth, updateUserInfo);

router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
