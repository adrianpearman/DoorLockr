import React, { Component } from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'

class DoorLockTracker extends Component {
  render(){
    const distance = (
      (this.props.distance * 1000).toFixed(2)
    )

    return (
      <div>
        { this.props.distance > 0.2 &&
        <div>
          <h3>{this.props.distance > 0.2 ? `You are currently ${distance} meters from home;` : null }
            <br/>
            Did you remember to lock your door?</h3>

            <ButtonToolbar>
              <Button
                bsStyle='success'
                bsSize='large'
                onClick={this.props.onDoorLockHandler}
              >
                Yes
              </Button>
              <Button
                bsStyle='danger'
                bsSize='large'
                onClick={this.props.onDoorUnlockHandler}
              >
                No
              </Button>
            </ButtonToolbar>
        </div>}
        { this.props.distance > 0.2 ? <h1>
          {this.props.doorLocked ? 'Your door is locked!' : 'Your door is unlocked!' }
        </h1> : null}
      </div>
    )
  }
}

export default DoorLockTracker
