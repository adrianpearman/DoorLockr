// Modules
import React from 'react'
import ReactDOM from 'react-dom'
import 'normalize.css/normalize.css'

// Components
import Homescreen from './components/Homescreen'

const App = () => {
  return (
     <div>
      <Homescreen />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
