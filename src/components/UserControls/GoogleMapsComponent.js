import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

class GoogleMapsComponent extends Component {
  render(){

    const MyMapComponent = withScriptjs(withGoogleMap((props) =>
      <GoogleMap
        defaultZoom={13}
        defaultCenter={{
          lat: props.destinationLatitude,
          lng: props.destinationLongitude
        }}
      >
        {props.isMarkerShown &&
          <Marker position={{
            lat: props.homeLatitude,
            lng: props.homeLongitude
          }} />}

        {props.isMarkerShown &&
          <Marker position={{
            lat: props.destinationLatitude,
            lng: props.destinationLongitude
          }} />}
      </GoogleMap>
    ))

    return(
      <MyMapComponent
        isMarkerShown // Map with a Marker
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        homeLatitude = {this.props.homeLatitude}
        homeLongitude = {this.props.homeLongitude}
        destinationLatitude = {this.props.destinationLatitude}
        destinationLongitude = {this.props.destinationLongitude}
      />
    )
  }
}

export default GoogleMapsComponent
