const router = require('express').Router();

const {
  createUser, getUsers, getUser, updateUserInfo, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:userId', getUser);

router.patch('/me', updateUserInfo);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
