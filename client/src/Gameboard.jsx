import React, {Component} from 'react';
import Gamespace from './Gamespace.jsx';
import PlaceShips from './PlaceShips.jsx';
let coordinates = require("./board.js")

class Gameboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      turn: 'PlayerOne',
      coordinates: coordinates,
      started: false,
      placingShip: false,
      playerOneShips: {'Battleship': '',
                        'Destroyer': '',
                        'Submarine': '',
                        'Sneakyboat': ''
      },
      playerTwoShips: {'Battleship': '',
                        'Destroyer': '',
                        'Submarine': '',
                        'Sneakyboat': ''
      },
      tempCoords: []
    }
    this.renderBoard = this.renderBoard.bind(this)
    this.attemptPlacement = this.attemptPlacement.bind(this)
    this.placingShip = this.placingShip.bind(this)
  }

  componentDidMount() {
    this.props.socket.emit('hello', 'gameboard')
  }


  renderBoard(player, ships) {
    console.log("SHIPS IN RENDER BOARD", ships)
    //ADD AN UPDATE COORDINATE AFTER TO LOOP THROUGH SHIP VALUES AND FOR EACH COORD SET STATE OF THAT COORD TO "SHIP FOR CONDITIONAL RENDER"
    let board = Object.keys(this.state.coordinates).map(coord => {
      return (
        <Gamespace coordinate={coord} player={player} socket={this.props.socket} placingShip={this.state.placingShip} attemptPlacement={this.attemptPlacement}/>
      )
    })
    return (board)
  }

   placingShip(ship, spaces) {
        let Battleship = {name: ship,
                          spaces:spaces,
                          coordinates:[]}

    this.setState({placingShip: Battleship}, () => {console.log("STATE NOW", this.state)})
  }

  placeShip(ship, coordinates) {
    if (ship === 'Battleship') {
        this.setState({playerOneShips:{Battleship:coordinates, Destroyer:this.state.playerOneShips.Destroyer, Submarine:this.state.playerOneShips.Submarine, Sneakyboat:this.state.playerOneShips.Sneakyboat}}, () => {
            console.log("PLACED " , ship , this.state.playerOneShips)
            }
        )
    }
    if (ship === 'Destroyer') {
        this.setState({playerOneShips:{Battleship:this.state.playerOneShips.Battleship, Destroyer: coordinates, Submarine:this.state.playerOneShips.Submarine, Sneakyboat:this.state.playerOneShips.Sneakyboat}}, () => {
            console.log("PLACED " , ship , this.state.playerOneShips)
            }
        )
    }
    if (ship === 'Submarine') {
        this.setState({playerOneShips:{Battleship:this.state.playerOneShips.Battleship, Destroyer: this.state.playerOneShips.Destroyer, Submarine:coordinates, Sneakyboat:this.state.playerOneShips.Sneakyboat}}, () => {
            console.log("PLACED " , ship , this.state.playerOneShips)
            }
        )
    }
    if (ship === 'Sneakyboat') {
        this.setState({playerOneShips:{Battleship:this.state.playerOneShips.Battleship, Destroyer: this.state.playerOneShips.Destroyer, Submarine:this.state.playerOneShips.Submarine, Sneakyboat:coordinates}}, () => {
            console.log("PLACED " , ship , this.state.playerOneShips)
            }
        )
    }
  }

  alreadyTaken(coord) {
    let isAllowed = true
    for (let key in this.state.playerOneShips) {
        if(this.state.playerOneShips[key]) {
            for (let i = 0; i < this.state.playerOneShips[key].length; i++) {
                let value = this.state.playerOneShips[key][i]
                if (value === coord) {
                    isAllowed = false
                }
            }
        }
    }
    return isAllowed
  }

  attemptPlacement (ship, coordinate) {
    if (this.alreadyTaken(coordinate)) {
        this.state.tempCoords.push(coordinate)
        if (ship.spaces === this.state.tempCoords.length) {
            console.log("READY TO PLACE ", ship.name, "at coords", this.state.tempCoords)
            this.placeShip(ship.name, this.state.tempCoords)
            this.setState({tempCoords: []}, () => {
                console.log("coords NOW", this.state.tempCoords)
            })
        }
    } else {
        console.log("SORRY THIS COORDINATE IS ALREADY TAKEN BY ANOTHER SHIP")
    }
  }

  render() {
    if (!this.state.started) {
        return(
            <div className='game'>
              <div className='board'>
                <div className ="player-one">
                    {this.renderBoard('player-one', this.state.playerOneShips)}
                </div>
                <div className ="player-two">
                    {this.renderBoard('player-two', this.state.playerTwoShips)}
                </div>
              </div>
              <PlaceShips board={this.state.coordinates} placingShip={this.placingShip}/>
            </div>
        )
    } else {
        return (
            <div className='game'>
              <div className='board'>
                <div className ="player-one">
                    {this.renderBoard('player-one')}
                </div>
                <div className ="player-two">
                    {this.renderBoard('player-two')}
                </div>
            </div>
          </div>
        )
    }
  }
}

export default Gameboard;