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

exports.getUserByUserId = getUserByUserId;
