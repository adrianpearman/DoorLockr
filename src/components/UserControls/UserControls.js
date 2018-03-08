import React, { Component } from 'react'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Button, ButtonToolbar } from 'react-bootstrap'
import axios from 'axios'
import geodist from 'geodist'

// Components
import DoorLockTracker from './DoorLockTracker'
import UpdateAddressForm from './UpdateAddressForm'
import GoogleAutoCompleteContainer from './GoogleAutoCompleteContainer'
import GoogleMapsComponent from './GoogleMapsComponent'

class UserControls extends Component {
  state = {
    updateAddress: false,
    leavingHouse: false,
    currentLatitude: undefined,
    currentLongitude: undefined,
    homeLatitude: undefined,
    homeLongitude: undefined,
    homeAddress: '',
    destinationLatitude: undefined,
    destinationLongitude: undefined,
    destinationAddress: '',
    destinationAddressFormatted: undefined,
    destinationConfirmed: false,
    viewMap: false,
    geoAccuracy: '',
    doorLocked: false,
    distance: undefined,
    appLogic: false,
    displayHome: true,
    displayError: false,
    confirmedDoorLocked: false
  }

  onUpdateAddressHandler = () => { this.setState({ updateAddress: true })}
  onLeavingHomeHandler = () => { this.setState({ leavingHouse: true, destinationConfirmed: false })}
  onStayingHomeHandler = () => { this.setState({ leavingHouse: false })}
  onViewMapHandler = () => { this.setState({ viewMap: true })}
  onCloseMapHandler = () => { this.setState({ viewMap: false })}
  onDoorLockHandler = () => { this.setState({ doorLocked: true })}
  onDoorUnlockHandler = () => { this.setState({ doorLocked: false })}
  onOpenLogicHandler = () => { this.setState({ appLogic: true, displayError: false, displayHome: false })}
  onCloseLogicHandler = () => { this.setState({ appLogic: false, displayError: true })}

  // Updates the user's address with the window locate function
  onUpdateHomeAddressHandler = (event) => {
    event.preventDefault()

    const success = (position) => {
      const coordinates = position.coords

      this.setState({ homeLatitude: coordinates.latitude })
      this.setState({ homeLongitude: coordinates.longitude})
      this.setState({ geoAccuracy: coordinates.accuracy})

      const API_KEY = this.props.API_KEY
      const URLGEOCODE = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.homeLatitude},${this.state.homeLongitude}&key=${API_KEY}`
      const geoAccuracy = `${this.state.geoAccuracy}`

      axios.get(URLGEOCODE).then((response) => {
        const address = response.data.results[1].formatted_address
        this.setState({ homeAddress: address })
      }).catch((error) => {
        console.log('Error', error);
      })

      if (confirm(`The application has updated your address to within an accuracy of ${this.state.geoAccuracy} meters of your current location. You are able to use this address or type in the updated address below`)) {
        this.setState({ updateAddress: false })
      }
    }

    const error = (error) => {
      console.warn(`ERROR(${error.code}): ${error.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error);
  }

  // Updates the user's address with the inputted information from the user
  onUpdateHomeFormHandler = (event) => {
    event.preventDefault()
    const API_KEY = this.props.API_KEY

    const street = event.target.elements.street.value.trim()
    const city = event.target.elements.city.value.trim()
    const country = event.target.elements.country.value.trim()
    const inputtedAddress = `${street} ${city} ${country}`
    console.log(inputtedAddress);
    const URLADDRESS = `https://maps.googleapis.com/maps/api/geocode/json?address=${inputtedAddress}&key=${API_KEY}`

    if (street.length === 0 || city.length === 0 || country.length === 0) {
      return alert(`Please enter an address`)
    } else if (inputtedAddress.toLowerCase() === this.state.homeAddress.toLowerCase()) {
      alert(`The address entered is the same as the one on your profile`)
    }else {
      axios.get(URLADDRESS).then((response) => {
        const formattedAddress = response.data.results[0].formatted_address
        let lat = response.data.results[0].geometry.location.lat
        let lng = response.data.results[0].geometry.location.lng
        console.log(lat, lng);
        this.setState({ homeLatitude: lat, homeLongitude: lng, homeAddress: formattedAddress, updateAddress: false })
      }).catch((error) => {
        console.log('Error', error);
      })
    }
  }

  onDestinationSubmitHandler = (event) => {
    event.preventDefault()
    const API_KEY = this.props.API_KEY

    geocodeByAddress(this.state.destinationAddress)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        const destinationLat = latLng.lat
        const destinationLng = latLng.lng
        this.setState({ destinationLatitude: destinationLat })
        this.setState({ destinationLongitude: destinationLng })
      })
      .catch((error) => {
        console.error('Error', error)
    })

    geocodeByAddress(this.state.destinationAddress)
      .then((results) => {
        const address = results[0].formatted_address
        this.setState({ destinationAddressFormatted: address })
        this.setState({ destinationConfirmed: true })
        this.setState({ leavingHouse: false })
      })
      .catch((error) => {
        console.error('Error', error)
    })
  }

  onChange = (destinationAddress) => {this.setState({
    destinationAddress: destinationAddress
  })}

  onUpdateCurrentLocationPassive = () => {this.setState({ leavingHouse: true }) }

  componentDidMount(){
    let timer = 1000 * 5  // calls the window object every 5 seconds

    const success = (position) => {
      const currentLatitude = position.coords.latitude
      const currentLongitude = position.coords.longitude
      this.setState({ currentLatitude: currentLatitude })
      this.setState({ currentLongitude: currentLongitude })
    }

    const error = (error) => { console.log('Error', error) }

    setInterval(() => {
      const coords = navigator.geolocation.getCurrentPosition(success, error)
      }, timer)

    setInterval(() => {
        const lat1 = this.state.homeLatitude
        const lat2 = this.state.currentLatitude
        const long1 = this.state.homeLongitude
        const long2 = this.state.currentLongitude

        const EarthRadius = 6371
        const radianLat1 = lat1 * (Math.PI /180)
        const radianLat2 = lat2 * (Math.PI /180)
        const diffLatitude = (lat2 - lat1) * (Math.PI / 180)
        const diffLongitude = (long2 - long1) * (Math.PI / 180)
        const a = Math.sin(diffLatitude/2) * Math.sin(diffLatitude/2) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.sin(diffLongitude/2) * Math.sin(diffLongitude/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = EarthRadius * c
        console.log(distance);
        if (distance) {
          // console.log('distance reached');
          this.setState({ distance: distance })
        }
      }, timer + 1)

    // Using the geodist plugin
    // setInterval(() => {
    //   const lat1 = this.state.homeLatitude
    //   const lat2 = this.state.currentLatitude
    //   const lon1 = this.state.homeLongitude
    //   const lon2 = this.state.currentLongitude
    //
    //   let distance = geodist({lat: lat1, lon: lon1}, {lat: lat2, lon: lon2},  {exact: true, unit: 'meters'})
    //   console.log(distance);
    // }, 1000 * 20)
  }

  componentWillMount(){
    const latitude = this.props.currentLatitude
    const longitude = this.props.currentLongitude
    this.setState({ homeLatitude: latitude })
    this.setState({ homeLongitude: longitude })

    if (latitude && longitude) {
      const API_KEY = this.props.API_KEY
      const URLGEOCODE = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`

      axios.get(URLGEOCODE).then((response) => {
        const address = response.data.results[1].formatted_address
        this.setState({ homeAddress: address })
      }).catch((error) => {
        console.log('Error', error);
      })
    }
  }

  render() {

    const destinationForm = (
      <div>
        <GoogleAutoCompleteContainer
           onSubmitHandler={this.onDestinationSubmitHandler}
           onChange={this.onChange}
           destinationAddress={this.state.destinationAddress}
         />
      </div>
    )

    const doorTracker = (
      <div>
        <DoorLockTracker
          onDoorLockHandler={this.onDoorLockHandler}
          onDoorUnlockHandler={this.onDoorUnlockHandler}
          doorLocked={this.state.doorLocked}
          distance={this.state.distance}
        />
      </div>
    )

    const googleMapsContainer = (
      <div>
        { this.state.destinationAddress ? null : <h4>Please enter a destination to view the map</h4>}
        { this.state.destinationAddress ?
          <Button
           onClick={this.onViewMapHandler}
           bsStyle='link'
           bsSize='large'
           disabled={this.state.viewMap & this.state.destinationAddress? true : false}>
            View Map
          </Button>
          :
          <Button
            onClick={this.onCloseMapHandler}
            bsStyle='link'
            bsSize='large'>
            Close Map
          </Button> }

        { this.state.viewMap ?
          <GoogleMapsComponent
            homeLatitude={this.state.homeLatitude}
            homeLongitude={this.state.homeLongitude}
            destinationLatitude={this.state.destinationLatitude}
            destinationLongitude={this.state.destinationLongitude}
          />
          : null
        }
      </div>
    )

    return (
      <div>
        { this.state.displayHome &&
          <div>
            <h2>Are you currently home?</h2>
            <ButtonToolbar>
              <Button
                bsStyle='primary'
                bsSize='large'
                onClick={this.onOpenLogicHandler}>
                  Yes
                </Button>
                <Button
                  bsStyle='warning'
                  bsSize='large'
                  onClick={this.onCloseLogicHandler}>
                    No
                </Button>
              </ButtonToolbar>
          </div>
        }
        { this.state.displayError && <h3>Please complete setup when you've returned home</h3>}
        { this.state.appLogic &&
          <div>
            <h3>Current Address: { this.state.homeAddress } </h3>
            <Button
              bsStyle='info'
              bsSize='large'
              onClick={this.onUpdateAddressHandler}>
              Update Address
            </Button>
            { this.state.updateAddress &&
              <UpdateAddressForm
                onUpdateHomeAddressHandler = {this.onUpdateHomeAddressHandler}
                onUpdateHomeFormHandler={this.onUpdateHomeFormHandler}
            />  }
            { this.state.destinationAddressFormatted ? <h3> Your selected address: {this.state.destinationAddressFormatted}</h3> : <h3>Planning on leaving home today?</h3>}
            <ButtonToolbar>
              <Button
                onClick={this.onLeavingHomeHandler, this.onUpdateCurrentLocationPassive}
                bsStyle='primary'
                bsSize='large'>
                Yes
              </Button>
              <Button
                onClick={this.onStayingHomeHandler}
                bsStyle='danger'
                bsSize='large'>
                No
              </Button>
              { this.state.destinationConfirmed &&
              <Button
                bsSize='warning'
                bsSize='large'
                onClick={this.ßonLeavingHomeHandler}>
                Change Destination
              </Button>
              }
            </ButtonToolbar>

            { this.state.leavingHouse ? destinationForm : null }


            { doorTracker }
            {/* { googleMapsContainer } */}
          </div>
        }
      </div>
    )
  }
}

export default UserControls
