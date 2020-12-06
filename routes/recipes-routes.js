const express = require('express');

const recipesControllers = require('../controllers/recipes-controller');

const router = express.Router();

router.get('/:rid', recipesControllers.getRecipeByRecipeId);

router.get('/user/:uid', recipesControllers.getAllRecipesByUserId);

router.post('/', recipesControllers.createRecipe);

router.patch('/:rid', recipesControllers.updateRecipe);

module.exports = router;
