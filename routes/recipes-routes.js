const express = require('express');

const recipesControllers = require('../controllers/recipes-controller');

const router = express.Router();

router.get('/:rid', recipesControllers.getRecipeByRecipeId);

router.get('/user/:uid', recipesControllers.getRecipeByUserId);

router.post('/', recipesControllers.createRecipe);

router.patch('/:rid', recipesControllers.updateRecipe);

module.exports = router;
