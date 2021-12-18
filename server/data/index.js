const recipeData = require('./receipes');
const postData = require('./posts');
const userData = require('./users');
const recipe = require('./recipes')
const todoData = require('./todo');

module.exports = {
  receipes: recipeData,
  users: userData,
  posts: postData,
  todos: todoData,
  recipes: recipe
}