const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');

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

const getRecipeByRecipeId = (req, res, next) => {
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
};

const getRecipeByUserId = (req, res, next) => {
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
};

const createRecipe = (req, res, next) => {
	const { id, basicDetails, ingredients, directions, creator } = req.body;

	const createdRecipe = {
		id: uuidv4(),
		basicDetails,
		ingredients,
		directions,
		creator,
	};

	dummyRecipes.push(createdRecipe);
	res.status(201).json({ recipe: createdRecipe });
};

exports.getRecipeByRecipeId = getRecipeByRecipeId;
exports.getRecipeByUserId = getRecipeByUserId;
exports.createRecipe = createRecipe;
