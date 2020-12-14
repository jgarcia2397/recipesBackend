const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 8 },
	title: { type: String, required: true },
	aboutMe: { type: String, required: true },
    favesToCook: { type: String, required: true },
    image: { type: String, required: true },
    recipes: { type: String, required: true },      // use dynamic ObjectId here later when connecting recipes to user
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
