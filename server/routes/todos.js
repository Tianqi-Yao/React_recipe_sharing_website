const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;  // ../data/books
const todoData = data.todos;  // ../data/reviews


router.get('/:id', async (req, res) => {  // :id is userId. return an array of all todos for this userId
  try {
      const todoOfUser = await todoData.getAllTodosOfUser(req.params.id);  // req.params.id is userId
      res.status(200).json(todoOfUser);
    } catch (e) {
      // console.log(e);
      res.status(404).json({ error: 'Todos with userId not found' });
      return;
    }
});


router.post('/:id', async (req, res) => {  // :id is userId  // SUCCESS: create todo to user 
  const aTodoData = req.body.params;  // get data that need to be posted. Pass by client side './src/components/Todo.js'
  
  if (!aTodoData.text || typeof aTodoData.text != 'string' ) {
    res.status(400).json({ error: 'You must provide todo text in string type' });
    return;
  }
  if (!aTodoData.day || typeof aTodoData.day != 'string' ) {
    res.status(400).json({ error: 'You must provide day in string type' });
    return;
  }

  try {  // check userId is valid
    const user = await userData.getUserById(req.params.id);  // req.params.id is userId
  } catch (e) {
    res.status(400).json({ error: 'User not found' });
    return;
  }
  
  // Json is valid and Todo can be created successful
  try {
    const { todoId, text, day, reminder } = aTodoData;  //! Creates a todo sub-document with the supplied data in the request body
    const userThatTodo = await todoData.createTodo(req.params.id, todoId, text, day, reminder)  //! req.params.id is "userId", userId is a string, thus we can add todo to correspnding user  
    res.status(200).json(userThatTodo);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


router.get('/todo/:id', async (req, res) => {  // :id is todoId
  try {
      const aTodo = await todoData.getTodoByTodoId(req.params.id);
      res.json(aTodo);
    } catch (e) {
      // console.log(e);
      res.status(404).json({ error: 'Todo not found' });
    }
});


router.patch('/todo/:id', async(req, res) => {  // :id is todoId
  const aEditedTodoData = req.body.params;

  try {
    const editedTodo = await todoData.toggleTodo(req.params.id, aEditedTodoData.todos);
    res.status(200).json(editedTodo);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: 'No todo have been changed, so no update has occurred'
    });
  }
});


router.delete('/todo/:id', async (req, res) => {  // :id is todoId   // SUCCESS: delete todo to user
  if (!req.params.id) throw 'You must specify an todoId to delete';
  try {
    const aTodo = await todoData.getTodoByTodoId(req.params.id);
  } catch (e) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  try {
    const deleteTodo = await todoData.deleteTodo(req.params.id);
    res.json({"todoId": req.params.id, "deleted": true});
  } catch (e) {
    // console.log(e);
    res.status(500).json( {error: e });
  }
});

module.exports = router;