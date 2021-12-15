import React from 'react'
import { useState } from 'react'

import Header from '../todo/Header';
import Footer from '../todo/Footer';
import Tasks from '../todo/Tasks';
import AddTask from '../todo/AddTask';

const Todo = () => {
  const [showAddTodo, setShowAddTodo] = useState(false);

  const [tasks, setTasks] = useState(  // state is immutable, you cannot directly change it, only use setTask() to change it
    [
      {
        id: 1,
        text: 'Buy 3 potatos, 1 vegetable',
        day: 'Jan 1st at 5:30pm',
        reminder: true,
      },
      {
        id: 2,
        text: 'Order barrelled water',
        day: 'Feb 2nd at 1:00pm',
        reminder: true,
      },
      {
        id: 3,
        text: 'Pay electricity bill',
        day: 'Feb 15th at 12:00pm',
        reminder: false,
      }
    ]
  );

  const addTask = (task) => { // add Task
    const id = Math.floor(Math.random() * 10000) + 1;  // create a random Id
    const newTask = {id, ...task };

    setTasks([...tasks, newTask])
  }

  const deleteTask = (id) => {  // delete Todo
    // console.log('delete', id)
    setTasks(tasks.filter((task) => task.id !== id));  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter . This delete Todo by click 'x'
  }

  const toggleReminder = (id) => {  // toggle Reminder
    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: !task.reminder } : task))  // implement !task.reminder 
  }

  return (
    <div className='container'>
      <Header title='To Do List' onAdd={() => setShowAddTodo(!showAddTodo)} showAdd={showAddTodo} />
      {showAddTodo && <AddTask onAdd={addTask} />}
      {tasks.length > 0 
        ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> 
      : ('No Todo. Add Your Todo Now !')}

      <Footer />
    </div>
  )
}

export default Todo
