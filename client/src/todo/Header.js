import React from 'react'
import Button from './Button'

const Header = (props) => {

  return (
    <header className='header'>
      <h1>{props.title}</h1>
      <Button color={props.showAdd ? 'red' : 'green'} text={props.showAdd ? 'Close' : 'Add'} onClick={props.onAdd}/>
    </header>
  )
}

Header.defaultProps = {
  title: 'To Do List',
}

// const headingStyle = {  // CSS in JS
//   color: 'red', 
//   background: 'black',
// }

export default Header
