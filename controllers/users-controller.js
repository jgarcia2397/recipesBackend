const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

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

const getUserByUserName = async (req, res, next) => {
	const userName = req.query.username;

	let user;
	try {
		// ToDo: In the future if there are many users with the same name, it this will only return one, most likely always the same user
		// ToDo: This is not case insensitive
		user = await User.findOne({ name: userName });
	} catch (err) {
		const error = new HttpError(
			'Getting user with given name failed, please try again.',
			500
		);
		return next(error);
	}

	if (!user) {
		return next(
			new HttpError('Could not find a user for the given user name.', 404)
		);
	}

	res.json({ user: user.toObject({ getters: true }) });
};

const updateUserProfile = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError(
				'The inputs you have passed are invalid, please check your data.',
				422
			)
		);
	}

	const userId = req.params.uid;
	const { name, currentUser, title, aboutMe, favesToCook, image } = req.body;

	if (currentUser !== req.userData.userId) {
		const error = new HttpError(
			'You are not allowed to update this profile.',
			401
		);
		return next(error);
	}

	let userToUpdate;
	try {
		userToUpdate = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			'Finding user to update failed, please try again.',
			500
		);
		return next(error);
	}

	if (!userToUpdate) {
		const error = new HttpError(
			'Could not find a user for the given user ID.',
			404
		);
		return next(error);
	}

	userToUpdate.name = name;
	userToUpdate.title = title;
	userToUpdate.aboutMe = aboutMe;
	userToUpdate.favesToCook = favesToCook;
	userToUpdate.image = image;

	try {
		await userToUpdate.save();
	} catch (err) {
		const error = new HttpError(
			'Updating user profile failed, please try again.',
			500
		);
		return next(error);
	}

	res.status(200).json({ user: userToUpdate.toObject({ getters: true }) });
};

const updateProfilePic = async (req, res, next) => {
	const userId = req.params.uid;
	const { currentUser } = req.body;

	if (currentUser !== req.userData.userId) {
		const error = new HttpError(
			'You are not allowed to update this profile picture.',
			401
		);
		return next(error);
	}

	let userToUpdate;
	try {
		userToUpdate = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			'Finding user to update failed, please try again.',
			500
		);
		return next(error);
	}

	if (!userToUpdate) {
		const error = new HttpError(
			'Could not find a user for the given user ID.',
			404
		);
		return next(error);
	}

	if (userToUpdate._id.toString() !== userId) {
		const error = new HttpError(
			'You are not allowed to update this profile picture.',
			401
		);
		return next(error);
	}

	userToUpdate.image = req.file.path;

	try {
		await userToUpdate.save();
	} catch (err) {
		const error = new HttpError(
			'Updating user profile picture failed, please try again.',
			500
		);
		return next(error);
	}

	res.status(200).json({ user: userToUpdate.toObject({ getters: true }) });
};

const userSignup = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError(
				'The inputs you have passed are invalid, please check your data.',
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

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError(
			'Could not create new user, please try again.',
			500
		);
		return next(error);
	}

	const newUser = new User({
		name,
		email,
		password: hashedPassword,
		title: 'Your Title',
		aboutMe: 'Tell us a bit about yourself!',
		favesToCook: 'Feel free to brag about your most famous dishes!',
		image:
			'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
		recipes: [],
	});

	try {
		await newUser.save();
	} catch (err) {
		const error = new HttpError('Signup failed, please try again.', 500);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: newUser.id, email: newUser.email },
			'shhh-lets-cook-shhh',
			{ expiresIn: '1h' }
		);
	} catch (err) {
		const error = new HttpError('Signup failed, please try again.', 500);
		return next(error);
	}

	res
		.status(201)
		.json({ userId: newUser.id, email: newUser.email, token: token });
};

const userLogin = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError(
				'The inputs you have passed are invalid, please check your data.',
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

	let isPasswordValid;
	try {
		isPasswordValid = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		const error = new HttpError('Login failed, please try again.', 500);
		return next(error);
	}

	if (!isPasswordValid) {
		return next(
			new HttpError('Provided password is invalid, please try again.', 401)
		);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			'shhh-lets-cook-shhh',
			{ expiresIn: '1h' }
		);
	} catch (err) {
		const error = new HttpError('Login failed, please try again.', 500);
		return next(error);
	}

	res.json({
		userId: existingUser.id,
		email: existingUser.email,
		token: token,
	});
};

exports.getUserByUserId = getUserByUserId;
exports.getUserByUserName = getUserByUserName;
exports.updateUserProfile = updateUserProfile;
exports.updateProfilePic = updateProfilePic;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
