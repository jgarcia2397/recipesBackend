const express = require('express');
const { check } = require('express-validator');

const recipesControllers = require('../controllers/recipes-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/:rid', recipesControllers.getRecipeByRecipeId);

router.get('/user/:uid', recipesControllers.getAllRecipesByUserId);

router.post(
	'/',
	fileUpload.single('image'),
	[
		check('basicDetails.recipeName').not().isEmpty(),
		check('basicDetails.prepTime').isNumeric(),
		check('basicDetails.prepTimeUnits').not().isEmpty(),
		check('basicDetails.cookTime').isNumeric(),
		check('basicDetails.cookTimeUnits').not().isEmpty(),
		check('basicDetails.servings').isNumeric(),
		check('basicDetails.difficulty').not().isEmpty(),
		check('ingredients').isArray({ min: 1 }),
		check('directions').isArray({ min: 1 }),
	],
	recipesControllers.createRecipe
);

router.patch(
	'/:rid',
	[
		check('basicDetails.recipeName').not().isEmpty(),
		check('basicDetails.prepTime').isNumeric(),
		check('basicDetails.prepTimeUnits').not().isEmpty(),
		check('basicDetails.cookTime').isNumeric(),
		check('basicDetails.cookTimeUnits').not().isEmpty(),
		check('basicDetails.servings').isNumeric(),
		check('basicDetails.difficulty').not().isEmpty(),
		check('ingredients').isArray({ min: 1 }),
		check('directions').isArray({ min: 1 }),
	],
	recipesControllers.updateRecipe
);

module.exports = router;
