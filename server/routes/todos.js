const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;  // ../data/books
const todoData = data.todos;  // ../data/reviews


router.get('/:id', async (req, res) => {  // :id is userId. return an array of all reviews for this userId
  try {
      const todoOfUser = await todoData.getAllTodosOfUser(req.params.id);  // req.params.id is userId
      res.status(200).json(todoOfUser);
    } catch (e) {
      // console.log(e);
      res.status(404).json({ error: 'Todos with userId not found' });
      return;
    }
});


router.post('/:id', async (req, res) => {  // :id is userId
  const aTodoData = req.body;  // get data that need to be posted
  
  if (!aTodoData.todoContent || typeof aTodoData.todoContent != 'string' ) {
    res.status(400).json({ error: 'You must provide todo todoContent in string type' });
    return;
  }
  if (!aTodoData.dateOfTodo || typeof aTodoData.dateOfTodo != 'string' ) {
    res.status(400).json({ error: 'You must provide dateOfTodo in string type' });
    return;
  }

  try {  // check userId is valid
    const user = await userData.getUserByUserId(req.params.id);  // req.params.id is userId
  } catch (e) {
    res.status(400).json({ error: 'User not found' });
    return;
  }
  
  // Json is valid and Todo can be created successful
  try {
    const { todoContent, dateOfTodo } = aTodoData;  //! Creates a todo sub-document with the supplied data in the request body
    const userThatTodo = await todoData.createTodo(req.params.id, todoContent, dateOfTodo)  //! req.params.id is "userId", userId is a string, thus we can add todo to correspnding user  
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


router.delete('/todo/:id', async (req, res) => {  // :id is todoId
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