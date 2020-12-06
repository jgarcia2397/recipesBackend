const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

const dummyRecipes = [
	{
		id: 'r1',
		basicDetails: {
			recipeName: 'PB & J Sandwich',
			prepTime: '1',
			prepTimeUnits: 'minutes',
			cookTime: '2',
			cookTimeUnits: 'minutes',
			servings: '1',
			difficulty: 'Easy',
		},
		ingredients: ['2 slices of bread', 'jam', 'peanut butter'],
		directions: [
			'toast slices of bread',
			'spread PB and J on toast',
			'stick two pieces of toast together',
		],
		creator: 'u1',
	},
];

router.get('/:rid', (req, res, next) => {
	const recipeId = req.params.rid;
	const recipe = dummyRecipes.find(r => {
		return r.id === recipeId;
	});

	if (!recipe) {
		return next(
			new HttpError('Could not find a recipe for the given recipe ID.', 404)
		);
	}

	res.json({ recipe: recipe });
});

router.get('/user/:uid', (req, res, next) => {
	const userId = req.params.uid;
	const recipe = dummyRecipes.find(r => {
		return r.creator === userId;
	});

	if (!recipe) {
		return next(
			new HttpError('Could not find a recipe for the given user ID.', 404)
		);
	}

	res.json({ recipe: recipe });
});

module.exports = router;
