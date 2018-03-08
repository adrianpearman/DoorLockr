import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import PlacesAutocomplete from 'react-places-autocomplete'

class GoogleMapContainer extends Component {
  render() {
    const inputProps = {
      value: this.props.destinationAddress,
      onChange: this.props.onChange,
    }

    const style = {
      marginTop: '10px'
    }

  return (
      <form
         onSubmit={this.props.onSubmitHandler}
         >
        <div style={style} >
          <PlacesAutocomplete inputProps={inputProps} />
          <Button
            bsStyle='primary'
            bsSize='large'
            type="submit"
            style={style}
          >
            Submit
          </Button>
        </div>

      </form>
    )
  }
}

export default GoogleMapContainer
