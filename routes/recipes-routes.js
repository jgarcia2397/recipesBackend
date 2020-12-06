const express = require('express');

const recipesControllers = require('../controllers/recipes-controller');

const router = express.Router();

router.get('/:rid', recipesControllers.getRecipeByRecipeId);

router.get('/user/:uid', recipesControllers.getRecipeByUserId);

module.exports = router;
