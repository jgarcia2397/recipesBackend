const express = require('express');

const usersControllers = require('../controllers/users-controller');

const router = express.Router();

router.get('/:uid', usersControllers.getUserByUserId);

router.patch('/:uid', usersControllers.updateUserProfile);

router.post('/signup', usersControllers.userSignup);

router.post('/login', usersControllers.userLogin);

module.exports = router;