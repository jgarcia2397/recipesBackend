const express = require('express');
const bodyParser = require('body-parser');

const recipesRoutes = require('./routes/recipes-routes');

const app = express();

app.use('/api/recipes', recipesRoutes);

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
