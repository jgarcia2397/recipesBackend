const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:uid', usersControllers.getUserByUserId);

router.get('/search/name', usersControllers.getUserByUserName);

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

router.use(checkAuth);

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

router.patch(
	'/profilePic/:uid',
	fileUpload.single('image'),
	usersControllers.updateProfilePic
);

module.exports = router;
