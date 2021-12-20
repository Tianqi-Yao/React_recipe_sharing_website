import React from 'react'
import { FaTimes } from 'react-icons/fa'  // use react icon

const Task = (props) => {
  return (
    <div className={`task ${props.task.reminder ? 'reminder' : ''}`}
    onDoubleClick={()=> props.onToggle( props.task.id)}>
      <h2>
        {props.task.text} <FaTimes style={{ color: 'red', cursor: 'pointer' }} onClick={() => props.onDelete(props.task.id)}
      />
      </h2>
      <p>{props.task.day}</p>
    </div>
  )
}

export default Task
