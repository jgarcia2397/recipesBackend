const express = require('express');
const bodyParser = require('body-parser');

const recipesRoutes = require('./routes/recipes-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/recipes', recipesRoutes);

app.use('/api/user', usersRoutes);

app.use((req, res, next) => {
	return next(new HttpError('Could not find this route.', 404));
});

// error handling middleware
app.use((error, req, res, next) => {
	if (res.headerSent) {
		// response already sent, forward error to next middleware
		return next(error);
	}

	res
		.status(error.code || 500)
		.json({ message: error.message || 'An unknown error occured!' });
});

app.listen(5000);
