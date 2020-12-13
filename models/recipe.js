const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
	basicDetails: {
		recipeName: { type: String, required: true },
		prepTime: { type: String, required: true },
		prepTimeUnits: { type: String, required: true },
		cookTime: { type: String, required: true },
		cookTimeUnits: { type: String, required: true },
		servings: { type: String, required: true },
		difficulty: { type: String, required: true },
	},
	ingredients: [{ type: String, required: true }],
	directions: [{ type: String, required: true }],
	image: { type: String, required: true },
	creator: { type: String, required: true },
});

module.exports = mongoose.model('Recipe', recipeSchema);
