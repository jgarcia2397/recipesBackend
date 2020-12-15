const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

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

const getUserByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			'Getting user with given ID failed, please try again.',
			500
		);
		return next(error);
	}

	if (!user) {
		return next(
			new HttpError('Could not find a user for the given user ID.', 404)
		);
	}

	res.json({ user: user.toObject({ getters: true }) });
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

const userSignup = async (req, res, next) => {
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

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Signup failed, please try again.', 500);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError('A user with this email already exists.', 422);
		return next(error);
	}

	const newUser = new User({
		name,
		email,
		password,
		title: 'Your Title',
		aboutMe: 'Tell us a bit about yourself!',
		favesToCook: 'Feel free to brag about your most famous dishes!',
		image:
			'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
		recipes: 'PB&J Sandwich, Spaghetti',
	});

	try {
		await newUser.save();
	} catch (err) {
		const error = new HttpError('Signup failed, please try again.', 500);
		return next(error);
	}

	res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const userLogin = async (req, res, next) => {
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

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Login failed, please try again.', 500);
		return next(error);
	}

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

	res.json({
		message: 'Login successful!',
		user: existingUser.toObject({ getters: true }),
	});
};

exports.getUserByUserId = getUserByUserId;
exports.updateUserProfile = updateUserProfile;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
