import React from 'react'
// import Task from './Task'
import { FaTimes } from 'react-icons/fa'  // use react icon

const Tasks = (props) => {

  return (
    <div>
      {props.tasks.map((task) => (
        <div key={task.id}>
          <div className={`task ${task.reminder ? 'reminder' : ''}`}
            onDoubleClick={()=> props.onToggle( task.id)}>
          <h3>
              {task.todoContent} <FaTimes style={{ color: 'red', cursor: 'pointer' }} onClick={() => props.onDelete(task.id)}
            />
          </h3>
            <p>{task.dateOfTodo}</p>
          </div>  
        </div>
      ))}
    </div>
  )
}

export default Tasks