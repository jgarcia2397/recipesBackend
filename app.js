const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recipesRoutes = require('./routes/recipes-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

app.use('/api/recipes', recipesRoutes);

app.use('/api/user', usersRoutes);

app.use((req, res, next) => {
	return next(new HttpError('Could not find this route.', 404));
});

// error handling middleware
app.use((error, req, res, next) => {
	if (req.file) {
		fs.unlink(req.file.path, (err) => {
			console.log(err);
		});
	}

	if (res.headerSent) {
		// response already sent, forward error to next middleware
		return next(error);
	}

	res
		.status(error.code || 500)
		.json({ message: error.message || 'An unknown error occured!' });
});

mongoose
	.connect(
		'mongodb+srv://joshua:Recipes2397@cluster0.8krg2.mongodb.net/recipes?retryWrites=true&w=majority'
	)
	.then(() => {
		app.listen(5000);
	})
	.catch(err => {
		console.log(err);
	});
