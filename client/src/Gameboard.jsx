import React, {Component} from 'react';
import Gamespace from './Gamespace.jsx';

class Gameboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      socket: this.props.socket,
      coordinates: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10']
    }
    this.createBoard = this.createBoard.bind(this)
  }

  componentDidMount() {
    this.state.socket.emit('hello', 'gameboard')
  }

  createBoard() {
    // console.log("CAELLED", this.state.coordinates)
    let board = this.state.coordinates.map(coord => {
      console.log('c', coord)
      return (
        <Gamespace coordinate={coord}/>
      )
    })
    return (board)
  }

  // createTable1() {
  //   let table = []
  //   // Outer loop to create parent
  //   for (let i = 0; i < 10; i++) {
  //     let children = []
  //     //Inner loop to create children
  //     for (let j = 0; j < 10; j++) {
  //       children.push(<td>{[`[${j + 1}]`]}</td>)
  //     }
  //     //Create the parent and add the children
  //     table.push(<tr>{children}</tr>)
  //   }
  //   return table
  // }

  // createTable2() {
  //   let table = []
  //   // Outer loop to create parent (i is # of rows)
  //   for (let i = 0; i < 10; i++) {
  //     let children = []
  //     //Inner loop to create children (j is # of columns)
  //     for (let j = 0; j < 10; j++) {
  //       let id = `${i}${j}2`
  //       // let htmlElement = <GameSpace id={id} value={[`[${i}${j + 1}]`]}/>
  //       // let htmlElement = <td id={id} >{[`[${i}${j + 1}]`]}</td>
  //       // children.push(htmlElement)
  //       children.push(id)
  //     }
  //     //Create the parent and add the children
  //     table.push(<tr>{children}</tr>)
  //   }
  //   console.log(table)
  //   return table
  // }

  render() {
    return(
      <div className='board'>
        {/*<table className='grid player-one'> {this.createTable1()} </table>
        <table className='grid player-two'> {this.createTable2()} </table>*/}
        <table>
        {this.createBoard()}
        </table>
      </div>
    )
  }
}

export default Gameboard;