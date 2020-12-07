const HttpError = require('../models/http-error');

const dummyUsers = [
	{
		id: 'u1',
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

exports.getUserByUserId = getUserByUserId;
exports.updateUserProfile = updateUserProfile;
