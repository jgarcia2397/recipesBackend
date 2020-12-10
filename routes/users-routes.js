const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controller');

const router = express.Router();

router.get('/:uid', usersControllers.getUserByUserId);

router.patch(
	'/:uid',
	[
		check('name').notEmpty(),
		check('title').notEmpty(),
		check('aboutMe').notEmpty(),
		check('favesToCook').notEmpty(),
	],
	usersControllers.updateUserProfile
);

router.post(
	'/signup',
	[
		check('name').notEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({min: 8}),
	],
	usersControllers.userSignup
);

router.post(
	'/login',
	[
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({min: 8}),
	],
	usersControllers.userLogin
);

module.exports = router;
