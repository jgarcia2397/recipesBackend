# recipesBackend

This repository is for backend source code. The backend application was developed with Express.js - it includes middleware for all routes, and also some custom middlware for authentication and file upload. I use mongoose to create and define models that relate to the documents stored in MongoDB. For authentication and route protection, I use JWT. File upload was initially done with multer, but Heroku cannot permanently store files, so I used an Amazon S3 bucket to do this.

The frontend source code can be viewed here: https://github.com/jgarcia2397/recipesFrontend.
