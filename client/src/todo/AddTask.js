import React from 'react'
import { useState } from 'react'

const AddTask = (props) => {
  const [text, setText] = useState('')
  const [day, setDay] = useState('')
  const [reminder, setReminder] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault();

    if (!text) {
      alert('Please add a todo')
      return 
    }

    props.onAdd({ text, day, reminder });

    // initialize attribute for next form submit
    setText('');
    setDay('');
    setReminder(false);
  }

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Todo</label>
        <input type='text' placeholder='Add Todo' value={text} onChange={(e) => setText(e.target.value)}></input>
      </div>

      <div className='form-control'>
        <label>Day & Time</label>
        <input type='text' placeholder='Add Day & Time' value={day} onChange={(e) => setDay(e.target.value)}></input>
      </div>

      <div className='form-control form-control-check'>
        <label>Set Reminder</label>
        <input type='checkbox' checked={reminder} value={reminder} onChange={(e) => setReminder(e.currentTarget.checked)}></input>
      </div>

      <input type='submit' value='Save Todo' className='btn btn-block' />
    </form>
  )
}

export default AddTask
