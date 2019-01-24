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
    this.readyToStart = this.readyToStart.bind(this)
  }

  componentDidMount() {
    this.props.socket.emit('hello', 'gameboard')
  }


  renderBoard(player, ships) {
    let board = Object.keys(this.state.coordinates).map(coord => {
        let squareHasShip = false
        for (let ship in ships) {
            if (ships[ship]) {
                for (let i =0; i < ships[ship].length; i ++) {
                    if (ships[ship][i] === coord) {
                      squareHasShip = true
                    }
                }
            }
        }
      if (squareHasShip) {
        return (
            <Gamespace coordinate={coord} player={player} socket={this.props.socket} placingShip={this.state.placingShip} attemptPlacement={this.attemptPlacement} hasShip={true}/>
        )
      } else {
        return (
        <Gamespace coordinate={coord} player={player} socket={this.props.socket} placingShip={this.state.placingShip} attemptPlacement={this.attemptPlacement} hasShip={false}/>
      )
      }
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
    //ONLY SETTING PLAYER ONE SHIPS FOR NOW WILL ADD OTHER PARAMETER LATER
    if (ship === 'Battleship' && this.checkCoordinates(coordinates)) {
        this.setState({playerOneShips:{Battleship:coordinates, Destroyer:this.state.playerOneShips.Destroyer, Submarine:this.state.playerOneShips.Submarine, Sneakyboat:this.state.playerOneShips.Sneakyboat}}, () => {
            console.log("PLACED " , ship , this.state.playerOneShips)
            }
        )
    } else if (ship === 'Destroyer' && this.checkCoordinates(coordinates)) {
        this.setState({playerOneShips:{Battleship:this.state.playerOneShips.Battleship, Destroyer: coordinates, Submarine:this.state.playerOneShips.Submarine, Sneakyboat:this.state.playerOneShips.Sneakyboat}}, () => {
            console.log("PLACED " , ship , this.state.playerOneShips)
            }
        )
    } else if (ship === 'Submarine' && this.checkCoordinates(coordinates)) {
        this.setState({playerOneShips:{Battleship:this.state.playerOneShips.Battleship, Destroyer: this.state.playerOneShips.Destroyer, Submarine:coordinates, Sneakyboat:this.state.playerOneShips.Sneakyboat}}, () => {
            console.log("PLACED " , ship , this.state.playerOneShips)
            }
        )
    } else if (ship === 'Sneakyboat' && this.checkCoordinates(coordinates)) {
        this.setState({playerOneShips:{Battleship:this.state.playerOneShips.Battleship, Destroyer: this.state.playerOneShips.Destroyer, Submarine:this.state.playerOneShips.Submarine, Sneakyboat:coordinates}}, () => {
            console.log("PLACED " , ship , this.state.playerOneShips)
            }
        )
    } else {
        console.log("COULD NOT PLACE SHIP")
    }
    this.setState({placingShip: false})
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
    for (let i = 0; i < this.state.tempCoords.length; i++) {
        if (this.state.tempCoords[i] === coord) {
            isAllowed = false
        }
    }
    return isAllowed
  }

  checkCoordinates (coordinates) {
    //ONLY DOESNT WORK PROPERLY WHEN DOING 'C' Shape with the battleship
    let valid = true
    let firstCoord = coordinates[0]
    let lastCoord = coordinates[coordinates.length-1]
    let prevCoord = coordinates[0]

    let sameRow = firstCoord.charCodeAt(0) - lastCoord.charCodeAt(0)
    let sameCol = firstCoord.slice(1) - lastCoord.slice(1)

    if (sameRow !==0 && sameCol !==0) {
        valid = false
        return
    } else {
        for (let i = 1; i < coordinates.length; i ++) {
            let cLetter = coordinates[i].charCodeAt(0)
            let pLetter = prevCoord.charCodeAt(0)
            let pNumber = prevCoord.slice(1)
            let cNumber = coordinates[i].slice(1)

            //CHECK TO SEE IF CURRENT LETTER IS IN SAME ROW AS PREVIOUS
            if (cLetter - pLetter === 0) {
                //IF IT IS CHECK TO SEE IF THE NUMBER IS ONE BESIDE THE PREVIOUS NUMBER
                if (cNumber - pNumber !==1 && cNumber - pNumber !==-1) {
                    //IF IT ISNT 1 or -1 it means the number is not beside previous
                    // console.log("BROKE THE ROW")
                    valid = false
                    return
                }
            }
            //IF IT DOESNT = 0 THEN THEY ARE IN DIFFERENT ROWS AND NEED TO CHECK NUMBERS
            else {
                //CHECK TO SEE IF CURRENT LETTER IS ONE LETTER BESIDE IF NOT ITS FALSE
                if (cLetter - pLetter !== 1 && cLetter - pLetter !== -1) {
                    valid = false
                    return
                }
                //IF LETTER IS BESIDE THEN CHECK IF THE NUMBER IS THE SAME ELSE ITS FALSE
                if (cNumber - pNumber !==0) {
                    // console.log("NUMBER NOT THE SAME ")
                    valid = false
                    return
                }
            }
            prevCoord = coordinates[i]
        }
    }
    return valid
  }

  attemptPlacement (ship, coordinate) {
    if (this.alreadyTaken(coordinate)) {
        this.state.tempCoords.push(coordinate)
        if (ship.spaces === this.state.tempCoords.length) {
            // console.log("READY TO PLACE ", ship.name, "at coords", this.state.tempCoords)
            this.placeShip(ship.name, this.state.tempCoords)
            this.setState({tempCoords: []}, () => {
                // console.log("coords NOW", this.state.tempCoords)
            })
        }
    } else {
        console.log("SORRY THIS COORDINATE IS ALREADY TAKEN BY ANOTHER SHIP")
    }
  }

  readyToStart(player){
    if (this.state.playerOneShips.Battleship && this.state.playerOneShips.Destroyer && this.state.playerOneShips.Submarine && this.state.playerOneShips.Sneakyboat) {
        console.log(`${player} is ready to start`)
    } else {
        console.log("PLAYER ONE SHIPS ARE NOT ALL PLACED")
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
              <PlaceShips board={this.state.coordinates} placingShip={this.placingShip} readyToStart={this.readyToStart}/>
            </div>
        )
    } else {
        return (
            <div className='game'>
              <div className='board'>
                <div className ="player-one">
                    {this.renderBoard('player-one', this.state.playerOneShips)}
                </div>
                <div className ="player-two">
                    {this.renderBoard('player-two', this.state.playerTwoShips)}
                </div>
            </div>
          </div>
        )
    }
  }
}

export default Gameboard;