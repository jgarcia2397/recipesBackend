const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Recipe = require('../models/recipe');
const User = require('../models/user');

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

const getRecipeByRecipeId = async (req, res, next) => {
	const recipeId = req.params.rid;

	let recipe;
	try {
		recipe = await Recipe.findById(recipeId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find recipe for this ID.',
			500
		);
		return next(error);
	}

	if (!recipe) {
		return next(
			new HttpError('Could not find a recipe for the given recipe ID.', 404)
		);
	}

	res.json({ recipe: recipe.toObject({ getters: true }) });
};

const getAllRecipesByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	let recipes;
	try {
		recipes = await Recipe.find({ creator: userId });
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find recipes of this user.',
			500
		);
		return next(error);
	}

	if (!recipes || recipes.length === 0) {
		return next(
			new HttpError('Could not find recipes for the given user ID.', 404)
		);
	}

	res.json({
		recipes: recipes.map(recipe => recipe.toObject({ getters: true })),
	});
};

const createRecipe = async (req, res, next) => {
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

	const createdRecipe = new Recipe({
		basicDetails,
		ingredients,
		directions,
		image: 'https://i.ytimg.com/vi/RoHWiA6pogg/maxresdefault.jpg',
		creator,
	});

	let user;
	try {
		user = await User.findById(creator);
	} catch (err) {
		const error = new HttpError(
			'Creating recipe failed, please try again.',
			500
		);
		return next(error);
	}

	if (!user) {
		const error = new HttpError(
			'Could not find existing user with the given ID.',
			404
		);
		return next(error);
	}

	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		await createdRecipe.save({ session: session });

		user.recipes.push(createdRecipe);
		await user.save({ session: session });
		await session.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Creating recipe failed, please try again.',
			500
		);
		return next(error);
	}

	res.status(201).json({ recipe: createdRecipe });
};

// ToDo: deleteRecipe?

const updateRecipe = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError(
				'The inputs you have passed are invalid, please check you data.',
				422
			)
		);
	}

	const recipeId = req.params.rid;
	const { basicDetails, ingredients, directions } = req.body;

	let recipeToUpdate;
	try {
		recipeToUpdate = await Recipe.findById(recipeId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find recipe to update.',
			500
		);
		return next(error);
	}

	recipeToUpdate.basicDetails = basicDetails;
	recipeToUpdate.ingredients = [...ingredients];
	recipeToUpdate.directions = [...directions];

	try {
		await recipeToUpdate.save();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not save updated recipe.',
			500
		);
		return next(error);
	}
	res.status(200).json({ recipe: recipeToUpdate.toObject({ getters: true }) });
};

exports.getRecipeByRecipeId = getRecipeByRecipeId;
exports.getAllRecipesByUserId = getAllRecipesByUserId;
exports.createRecipe = createRecipe;
exports.updateRecipe = updateRecipe;
