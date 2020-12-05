const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
	console.log('GET request in Recipes');
	res.json({ message: 'Routing works!' });
});

module.exports = router;
