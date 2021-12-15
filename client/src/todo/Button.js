import React from 'react'
import PropTypes from 'prop-types'

const Button = (props) => {


  return (
    <div>
      <button onClick={props.onClick} style={{backgroundColor: props.color}} className='btn'>{props.text}</button>
    </div>
  )
}

Button.defaultProps = {  // default props
  color: 'steelblue'
}

Button.propTypes = {  // prop types check
  text: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func
}

export default Button
