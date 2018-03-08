import React, { Component } from 'react'
import { Col } from 'react-bootstrap'

import Header from './Header'
import UserControls from './UserControls/UserControls'
import axios from 'axios'

class Homescreen extends Component {
  state = {
    geolocationError: false,
    currentLatitude: undefined,
    currentLongitude: undefined
  }

  API_KEY = 'AIzaSyAmair7VS0zGM-EcAuXfOPgo1u3qQ0nMrU'
  URLGEOCODE = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLatitude},${this.state.curcurrentLongitude}&key=${this.API_KEY}`

  componentDidMount(){
    const success = (position) => {
      const coordinates = position.coords
      const latitude = coordinates.latitude
      const longitude = coordinates.longitude
      this.setState({ currentLatitude: latitude})
      this.setState({ currentLongitude: longitude})
    }

    const error = (error) => {
      console.log(error);
      this.setState({ geolocationError: true })
    }

    navigator.geolocation.getCurrentPosition(success, error)
  }

  render() {
    return (
      <div>
        <Header />
        <Col md={8} mdOffset={2}>
          { this.state.currentLatitude & this.state.currentLongitude ?
          <UserControls
            API_KEY = {this.API_KEY}
            geolocationError={this.state.geolocationError}
            currentLatitude={this.state.currentLatitude}
            currentLongitude={this.state.currentLongitude}
            className='logic'
          />
            : <h2 className='logic'>Loading Application...</h2>
          }
        </Col>
      </div>
    )
  }
}

export default Homescreen
