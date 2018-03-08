import React, { Component } from 'react'
import { Button, Col } from 'react-bootstrap'

const UpdateAddressForm = (props) => {
  const style = {
    width: '85%',
    float: 'right'
  }

  const buttonStyle = {
    color: '#fff',
    backgroundColor: '#449d44',
    borderColor: '#398439',
    padding: '10px 16px',
    fontSize: '18px',
    lineHeight: '1.3333333',
    borderRadius: '6px'
  }
  return(
    <div>
      <b>Please update your address by either typing in address or using the 'Location Me' button</b>
      <br />
      <Button
        bsStyle='info'
        bsSize='large'
        onClick={props.onUpdateHomeAddressHandler}
      >
        Locate Me
      </Button>

      <form onSubmit={props.onUpdateHomeFormHandler}>
          <h4>Street:
            <input
              name='street'
              type='text'
              style={style}
            />
          </h4>
          <h4>City:
            <input
              name='city'
              type='text'
              style={style}
            />
          </h4>
          <h4>Country:
            <input
              name='country'
              type='text'
              style={style}
            />
          </h4>
          <br />
          <button style={buttonStyle}>Submit New Address</button>

      </form>
    </div>
  )
}

// class UpdateAddressForm extends Component {
//   render(){
//
//   }
// }

export default UpdateAddressForm
