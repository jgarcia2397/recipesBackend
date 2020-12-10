const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const dummyUsers = [
	{
		id: 'u1',
		email: 'josh@test.com',
		password: 'testPassword',
		name: 'Joshua Garcia',
		title: 'Master Chef',
		aboutMe: 'Gordon Ramsey is my hero but I can barely cook :( sad life...',
		favesToCook: 'Idiot sandwiches',
	},
];

const getUserByUserId = (req, res, next) => {
	const userId = req.params.uid;
	const user = dummyUsers.find(u => {
		return u.id === userId;
	});

	if (!user) {
		return next(
			new HttpError('Could not find a user for the given user ID.', 404)
		);
	}

	res.json({ user: user });
};

const updateUserProfile = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError(
				'The inputs you have passed are invalid, please check you data.',
				422
			)
		);
	}

	const userId = req.params.uid;
	const { name, title, aboutMe, favesToCook } = req.body;

	const userToUpdate = {
		...dummyUsers.find(u => {
			return u.id === userId;
		}),
	};
	const userIndex = dummyUsers.findIndex(u => {
		return u.id === userId;
	});

	userToUpdate.name = name;
	userToUpdate.title = title;
	userToUpdate.aboutMe = aboutMe;
	userToUpdate.favesToCook = favesToCook;

	dummyUsers[userIndex] = userToUpdate;

	res.status(200).json({ user: userToUpdate });
};

const userSignup = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError(
				'The inputs you have passed are invalid, please check you data.',
				422
			)
		);
	}

	const { name, email, password } = req.body;

	const existingUser = dummyUsers.find(u => {
		return u.email === email;
	});

	if (existingUser) {
		return next(new HttpError('A user with this email already exists.', 422));
	}

	const newUser = {
		id: uuidv4(),
		email,
		password,
		name,
		title: 'Your Title',
		aboutMe: 'Tell us a bit about yourself!',
		favesToCook: 'Feel free to brag about your most famous dishes!',
	};

	dummyUsers.push(newUser);

	res.status(201).json({ user: newUser });
};

const userLogin = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError(
				'The inputs you have passed are invalid, please check you data.',
				422
			)
		);
	}

	const { email, password } = req.body;

	const existingUser = dummyUsers.find(u => {
		return u.email === email;
	});

	if (!existingUser) {
		return next(
			new HttpError('This user email is not registered, please try again.', 401)
		);
	}

	if (existingUser.password !== password) {
		return next(
			new HttpError('Provided password is invalid, please try again.', 401)
		);
	}

	res.json({ message: 'Login successful!' });
};

exports.getUserByUserId = getUserByUserId;
exports.updateUserProfile = updateUserProfile;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
