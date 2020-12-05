const express = require('express');
const bodyParser = require('body-parser');

const recipesRoutes = require('./routes/recipes-routes');

const app = express();

app.use(recipesRoutes);

app.listen(5000);