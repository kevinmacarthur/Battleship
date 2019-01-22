import React, {Component} from 'react';
import Gamespace from './Gamespace.jsx';
let board = require("./board.js")

class Gameboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      socket: this.props.socket,
      coordinates: board
    }
    this.renderBoard = this.renderBoard.bind(this)
  }

  componentDidMount() {
    this.state.socket.emit('hello', 'gameboard')
  }

  renderBoard(player) {
    let board = Object.keys(this.state.coordinates).map(coord => {
      return (
        <Gamespace coordinate={coord} player={player}/>
      )
    })
    return (board)
  }

  render() {
    return(
      <div className='board'>
        <div className ="player-one">
            {this.renderBoard('player-one')}
        </div>
        <div className ="player-two">
            {this.renderBoard('player-two')}
        </div>
      </div>
    )
  }
}

export default Gameboard;