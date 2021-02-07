const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const aws = require('aws-sdk');

const recipesRoutes = require('./routes/recipes-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();
aws.config.region = 'us-east-2';

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.get('/sign-s3', (req, res) => {
	const s3 = new aws.S3();
	const fileName = req.query['file-name'];
	const fileType = req.query['file-type'];
	const s3Params = {
		Bucket: process.env.S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read',
	};

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if (err) {
			console.log(err);
			return res.end();
		}
		const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
		};

		// console.log(JSON.stringify(returnData));

		res.write(JSON.stringify(returnData));
		res.end();
	});
});

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
		fs.unlink(req.file.path, err => {
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
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8krg2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
	)
	.then(() => {
		app.listen(process.env.PORT || 5000);
	})
	.catch(err => {
		console.log(err);
	});
