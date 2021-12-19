import React from 'react'
import { FaTimes } from 'react-icons/fa'  // use react icon

const Task = (props) => {
  return (
    <div className={`task ${props.task.reminder ? 'reminder' : ''}`}
    onDoubleClick={()=> props.onToggle( props.task.id)}>
      <h3>
        {props.task.todoContent} <FaTimes style={{ color: 'red', cursor: 'pointer' }} onClick={() => props.onDelete(props.task.id)}
      />
      </h3>
      <p>{props.task.dateOfTodo}</p>
    </div>
  )
}

export default Task
