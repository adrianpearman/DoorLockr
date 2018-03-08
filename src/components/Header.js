import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

const Header = () => {
  const style = {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    padding: '1%'
  }

  return(
    <div>
      <Navbar inverse>
        <Navbar.Header style={style}>
          <h1>Door Trackr</h1>
        </Navbar.Header>
      </Navbar>
    </div>
  )
}

export default Header
