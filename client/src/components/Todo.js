import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios";
import { Link } from "react-router-dom";
import database from "../config/awsUrl"

// for userId
import {useAuth} from "../contexts/AuthContext"

import Header from '../todo/Header';
import Footer from '../todo/Footer';
import Tasks from '../todo/Tasks';
import AddTask from '../todo/AddTask';

const Todo = (props) => {
  const [showAddTodo, setShowAddTodo] = useState(false);
  const {currentUser}  = useAuth()

  // const [tasks, setTasks] = useState(  // state is immutable, you cannot directly change it, only use setTask() to change it
  //   [
  //     {
  //       id: 1,
  //       text: 'Buy 3 potatos, 1 vegetable',
  //       day: 'Jan 1st at 5:30pm',
  //       reminder: true,
  //     },
  //     {
  //       id: 2,
  //       text: 'Order barrelled water',
  //       day: 'Feb 2nd at 1:00pm',
  //       reminder: true,
  //     },
  //     {
  //       id: 3,
  //       text: 'Pay electricity bill',
  //       day: 'Feb 15th at 12:00pm',
  //       reminder: false,
  //     }
  //   ]
  // );
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`${database}/todos/${currentUser.uid}`);
        // console.log(data.data.results);
        console.log("todo data in Todo.js: ", data);
        setTasks(data);
      } catch (e) {
        console.log(e)
      }
    }

    fetchData()  // call fetchData()
  }, []);


  const addTask = async (task) => { // add Task
    let id = Math.floor(Math.random() * 10000) + 1;  // create a random Id
    console.log(typeof id);
    id = id.toString();
    const newTask = {id, ...task };

    console.log("current userId: ", currentUser.uid);
    setTasks([...tasks, newTask]);
    let newTodoObj = await axios.post(`${database}/todos/${currentUser.uid}`, { params: {   // currentUser.uid is userId
      uid: currentUser.uid,  
      todoId: id, 
      text: newTask.text, 
      day: newTask.day, 
      reminder: newTask.reminder 
    }});  // uid is name in server side. This will be passed to corresponding router in Server Side './routes/todos.js' 
    console.log('newTodoObj: ', newTodoObj);
  }

  const deleteTask = async (id) => {  // delete Todo. id is todoId
    // console.log('delete', id)
    setTasks(tasks.filter((task) => task.id !== id));  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter . This delete Todo by click 'x'
    console.log(id);
    let isDeletedTask = await axios.delete(`${database}/todos/todo/${id}`);
    console.log('deleteTodo: ', isDeletedTask);
  }

  const toggleReminder = async (id) => {  // toggle Reminder. id is todoId
    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: !task.reminder } : task))  // implement !task.reminder 
    let isToggledReminder = await axios.patch(`${database}/todos/todo/${id}`, { params: { todos : tasks.map((task) => task.id === id)}});
    console.log('toggleTodo: ', isToggledReminder);
  }

  return (
    <div className='container'>
      <Header title='To Do List' onAdd={() => setShowAddTodo(!showAddTodo)} showAdd={showAddTodo} />
      {showAddTodo && <AddTask onAdd={addTask} />}

      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : ('No Todo. Add Your Todo Now !')}

      <Footer />
    </div>
  )
}

export default Todo
