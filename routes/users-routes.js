const express = require('express');

const usersControllers = require('../controllers/users-controller');

const router = express.Router();

router.get('/:uid', usersControllers.getUserByUserId);

router.patch('/:uid', usersControllers.updateUserProfile);

module.exports = router;