const recipeData = require('./receipes');
const postData = require('./posts');
const userData = require('./users');
const recipe = require('./recipes')

module.exports = {
  receipes: recipeData,
  users: userData,
  posts: postData,
  recipes: recipe
}