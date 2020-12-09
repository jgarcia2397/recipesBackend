const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

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
	{
		id: 'r2',
		basicDetails: {
			recipeName: 'Ham Sandwich',
			prepTime: '2',
			prepTimeUnits: 'minutes',
			cookTime: '3',
			cookTimeUnits: 'minutes',
			servings: '1',
			difficulty: 'Easy',
		},
		ingredients: ['2 slices of bread', 'ham', 'swiss cheese', 'mayo'],
		directions: [
			'toast slices of bread',
			'spread mayo',
			'place ham and cheese on toast',
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

const getAllRecipesByUserId = (req, res, next) => {
	const userId = req.params.uid;
	const recipes = dummyRecipes.filter(r => {
		return r.creator === userId;
	});

	if (!recipes || recipes.length === 0) {
		return next(
			new HttpError('Could not find recipes for the given user ID.', 404)
		);
	}

	res.json({ recipes: recipes });
};

const createRecipe = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError(
				'The inputs you have passed are invalid, please check you data.',
				422
			)
		);
	}

	const { basicDetails, ingredients, directions, creator } = req.body;

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

// ToDo: deleteRecipe?

const updateRecipe = (req, res, next) => {
	const recipeId = req.params.rid;
	const { basicDetails, ingredients, directions } = req.body;

	const recipeToUpdate = {
		...dummyRecipes.find(r => {
			return r.id === recipeId;
		}),
	};
	const recipeIndex = dummyRecipes.findIndex(r => {
		return r.id === recipeId;
	});

	recipeToUpdate.basicDetails = basicDetails;
	recipeToUpdate.ingredients = [...ingredients];
	recipeToUpdate.directions = [...directions];

	dummyRecipes[recipeIndex] = recipeToUpdate;
	res.status(200).json({ recipe: recipeToUpdate });
};

exports.getRecipeByRecipeId = getRecipeByRecipeId;
exports.getAllRecipesByUserId = getAllRecipesByUserId;
exports.createRecipe = createRecipe;
exports.updateRecipe = updateRecipe;
