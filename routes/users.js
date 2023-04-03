const router = require('express').Router();

const {
  getCurrentUser, getUsers, getUser, updateUserInfo, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUser);

router.patch('/me', updateUserInfo);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
