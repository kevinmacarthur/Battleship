import React, {Component} from 'react';
import Gamespace from './Gamespace.jsx';
import PlaceShips from './PlaceShips.jsx';
import update from 'immutability-helper';
let coordinates = require("./board.js")

class Gameboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      turn: 'PlayerOne',
      coordinates: coordinates,
      started: false,
      placingShip: false,
      playerOne:{ships: {'Battleship': '',
                        'Destroyer': '',
                        'Submarine': '',
                        'Sneakyboat': ''
      },
        tempCoords: [],
        ready:false
      },
      playerTwo:{ships: {'Battleship': '',
                        'Destroyer': '',
                        'Submarine': '',
                        'Sneakyboat': ''
      },
        tempCoords: [],
        ready:false
     }
    }
    this.renderBoard = this.renderBoard.bind(this)
    this.attemptPlacement = this.attemptPlacement.bind(this)
    this.placingShip = this.placingShip.bind(this)
    this.readyToStart = this.readyToStart.bind(this)
    this.clearTemp = this.clearTemp.bind(this)
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

   placingShip(ship, spaces, player) {
        let Battleship = {name: ship,
                          spaces:spaces,
                          player: player,
                          coordinates:[]}

    this.setState({placingShip: Battleship}, () => {console.log("STATE NOW", this.state)})
  }

  placeShip(ship, coordinates, player) {
    if (ship === 'Battleship' && this.checkCoordinates(coordinates)) {
        this.setState({[player]:{ships:{Battleship:coordinates, Destroyer:this.state[player].ships.Destroyer, Submarine:this.state[player].ships.Submarine, Sneakyboat:this.state[player].ships.Sneakyboat}, tempCoords:[]}}, () => {
            console.log("PLACED " , ship , this.state[player])
            }
        )
    } else if (ship === 'Destroyer' && this.checkCoordinates(coordinates)) {
        this.setState({[player]:{ships:{Battleship:this.state[player].ships.Battleship, Destroyer:coordinates, Submarine:this.state[player].ships.Submarine, Sneakyboat:this.state[player].ships.Sneakyboat}, tempCoords:[]}}, () => {
            console.log("PLACED " , ship , this.state[player])
            }
        )
    } else if (ship === 'Submarine' && this.checkCoordinates(coordinates)) {
        this.setState({[player]:{ships:{Battleship:this.state[player].ships.Battleship, Destroyer:this.state[player].ships.Destroyer, Submarine:coordinates, Sneakyboat:this.state[player].ships.Sneakyboat}, tempCoords:[]}}, () => {
            console.log("PLACED " , ship , this.state[player])
            }
        )
    } else if (ship === 'Sneakyboat' && this.checkCoordinates(coordinates)) {
        this.setState({[player]:{ships:{Battleship:this.state[player].ships.Battleship, Destroyer:this.state[player].ships.Destroyer, Submarine:this.state[player].ships.Submarine, Sneakyboat:coordinates},tempCoords:[]}}, () => {
            console.log("PLACED " , ship , this.state[player])
            }
        )
    } else {
        alert("COULD NOT PLACE SHIP")
    }
    this.setState({placingShip: false})
  }

  notAlreadyTaken(coord, player) {
    let isAllowed = true
    for (let key in this.state[player].ships) {
        if(this.state[player].ships[key]) {
            for (let i = 0; i < this.state[player].ships[key].length; i++) {
                let value = this.state[player].ships[key][i]
                if (value === coord) {
                    isAllowed = false
                }
            }
        }
    }
    for (let i = 0; i < this.state[player].tempCoords.length; i++) {
        if (this.state[player].tempCoords[i] === coord) {
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

  attemptPlacement (ship, coordinate, player) {
    if (this.notAlreadyTaken(coordinate, player)) {
        this.state[player].tempCoords.push(coordinate)
        if (ship.spaces === this.state[player].tempCoords.length) {
            console.log("READY TO PLACE ", ship.name, "at coords", this.state[player].tempCoords, 'for', player)
            this.placeShip(ship.name, this.state[player].tempCoords, player)
        }
    } else {
        alert("SORRY THIS COORDINATE IS ALREADY TAKEN BY ANOTHER SHIP")
        this.clearTemp(player)
    }
  }

  readyToStart(player){
    if (this.state[player].ships.Battleship && this.state[player].ships.Destroyer && this.state[player].ships.Submarine && this.state[player].ships.Sneakyboat) {
        const newObj = update(this.state[player], {ready:{$set: this.state[player].ready=true}})
        this.setState({[player]:newObj})
        console.log("STATE IS", this.state)
    } else {
        alert(`${player} hasn't placed all their ships yet`)
    }
  }

  clearTemp(player){
    this.setState({[player]:{ships:{Battleship:this.state[player].ships.Battleship, Destroyer:this.state[player].ships.Destroyer, Submarine:this.state[player].ships.Submarine, Sneakyboat:this.state[player].ships.Sneakyboat},tempCoords:[]}}, () =>
      console.log("CLEARED TEMP COORDINATE"))
  }

  render() {
    if (!this.state.started) {
        return(
            <div className='game'>
              <div className='board'>
                <div className ="player-one">
                    {this.renderBoard('playerOne', this.state.playerOne.ships)}
                    <PlaceShips board={this.state.coordinates} placingShip={this.placingShip} currentlyPlacingShip={this.state.placingShip} player="playerOne"/>
                    <div className="buttons">
                    <button onClick={() => this.readyToStart('playerOne')}> READY </button>
                    <button onClick={() => this.clearTemp('playerOne')}> Clear </button>
                    </div>
                </div>
                <div className ="player-two">
                    {this.renderBoard('playerTwo', this.state.playerTwo.ships)}
                    <PlaceShips board={this.state.coordinates} placingShip={this.placingShip} currentlyPlacingShip={this.state.placingShip} player="playerTwo"/>
                    <div className="buttons">
                    <button onClick={() => this.readyToStart('playerTwo')}> READY </button>
                    <button onClick={() => this.clearTemp('playerTwo')}> Clear </button>
                    </div>
                </div>
              </div>
            </div>
        )
    } else {
        return (
            <div className='game'>
              <div className='board'>
                <div className ="player-one">
                    {this.renderBoard('playerOne', this.state.playerOne.ships)}
                </div>
                <div className ="player-two">
                    {this.renderBoard('playerTwo', this.state.playerTwo.ships)}
                </div>
            </div>
          </div>
        )
    }
  }
}

export default Gameboard;