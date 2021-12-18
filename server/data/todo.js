const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let usersJS = require('./users');  // we need use async method of users ❤add todo to user

let { ObjectId } = require('mongodb');


module.exports = {

  getAllTodosOfUser: async function(userId) {
    if (!userId) throw 'You must provide an userId to get';
    if (typeof userId !== 'string' || userId.length === 0) throw "userId must be string type and not an empty string";
    if (!ObjectId.isValid(userId)) throw "userId provided is not a valid ObjectId";  //MongoDB Node check if objectid is valid. https://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid
    let parsedUserId = ObjectId(userId);
    const userCollection = await users();

    const currentUser = await userCollection.findOne({ _id: parsedUserId });
    return currentUser.todos;
  },

  createTodo: async function(userId, todoContent, dateOfTodo) {  //userId is string
    if (todoContent == " " || dateOfTodo == " ") throw "Strings with empty spaces are NOT valid strings";
    if (!userId || !todoContent || !dateOfTodo) throw "All fields must have valid values"
    if (typeof todoContent !== 'string' || typeof dateOfTodo !== 'string') throw 'The todoContent, dateOfTodo must be string type';
    if (todoContent.length === 0) throw "The todoContent cannot be empty strings";
    let parsedUserId = ObjectId(userId); 
    const userCollection = await users();

    const newTodo = {
      _id: ObjectId(),
      todoContent: todoContent,
      dateOfTodo: dateOfTodo,
    };
    const currentUser = await userCollection.updateOne({ _id: parsedUserId }, { $addToSet: { todos: newTodo}});  //! add todo to user

    // console.log(currentUser);
    // console.log(userJS.getBookByBookId(userId));
    return userJS.getUserByUserId(userId);
  },

  getTodoByTodoId: async function(todoId) {
    if (!todoId) throw 'You must provide an todoId to get';
    if (typeof todoId !== 'string' || todoId.length === 0) throw "the todoId must be string type and not an empty string";
    if (!ObjectId.isValid(todoId)) throw "the todoId provided is not a valid ObjectId";  //MongoDB Node check if objectid is valid. https://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid
    const userCollection = await users();

    let retTodo =  {};
    let tarUserObj = await userCollection.findOne({ 'todos._id': ObjectId(todoId)});  // https://stackoverflow.com/questions/14040562/how-to-search-in-array-of-object-in-mongodb
    let todoList = tarUserObj['todos'];
    
    for (let todo of todoList) {
      if (todo['_id'].toString() === ObjectId(todoId).toString())
        retTodo = todo;
    }
    if (!retTodo) throw "Cannot find todo with that todoId"

    return retTodo;  // https://stackoverflow.com/questions/49508700/convert-mongodb-object-to-javascript-object
  },

  deleteTodo: async function(todoId) {
    if (!todoId) throw 'You must provide an todoId for removing';
    if (typeof todoId !== 'string' || todoId.length === 0) throw "The todoId must be string type and not an empty string";
    if (!ObjectId.isValid(todoId)) throw "The todoId provided is not a valid ObjectId";
    const userCollection = await users();

    // find target Book Obj, get userId
    let tarUserObj = await userCollection.findOne({ 'todos._id': ObjectId(todoId) });
    userId = tarUserObj._id;  // userId is ObjectId

    let delUserObj = await userCollection.updateOne({ '_id': userId }, { $pull: { todos: {_id : ObjectId(todoId) }}})

    return delUserObj;
  },
};

