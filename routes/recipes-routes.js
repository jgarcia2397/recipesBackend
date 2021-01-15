const express = require('express');
const { check } = require('express-validator');

const recipesControllers = require('../controllers/recipes-controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:rid', recipesControllers.getRecipeByRecipeId);

router.get('/user/:uid', recipesControllers.getAllRecipesByUserId);

router.use(checkAuth);		// Route protection for all below routes

router.post(
	'/',
	fileUpload.single('image'),
	[
		check('recipeName').not().isEmpty(),
		check('prepTime').isNumeric(),
		check('prepTimeUnits').not().isEmpty(),
		check('cookTime').isNumeric(),
		check('cookTimeUnits').not().isEmpty(),
		check('servings').isNumeric(),
		check('difficulty').not().isEmpty(),
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

router.delete('/:rid', recipesControllers.deleteRecipe);

module.exports = router;
