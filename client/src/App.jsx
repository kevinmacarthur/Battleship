import React, {Component} from 'react';
import Gameboard from './Gameboard.jsx';
const io = require('socket.io-client')
const socket = io.connect('http://localhost:3001')

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      socket: socket
    }
  }

  componentDidMount() {
    socket.emit('hello', 'hi')

  }

  render() {
    return (
      <div> Hi
      <Gameboard socket={this.state.socket}/>
      </div>
    )
  }
}

export default App;