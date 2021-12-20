const recipeData = require('./receipes');
const userData = require('./users');
const recipe = require('./recipes')
const todoData = require('./todo');
const likeData = require('./likes');

module.exports = {
  receipes: recipeData,
  users: userData,
  todos: todoData,
  recipes: recipe,
  likes: likeData,
}