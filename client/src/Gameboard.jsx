import React, {Component} from 'react';

class Gameboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      socket: this.props.socket,
      rows: 10,
      columns: 10
    }
  }

  componentDidMount() {
    this.state.socket.emit('hello', 'gameboard')
  }

  createTable1() {
    let table = []
    // Outer loop to create parent
    for (let i = 0; i < 10; i++) {
      let children = []
      //Inner loop to create children
      for (let j = 0; j < 10; j++) {
        children.push(<td>{[`[${j + 1}]`]}</td>)
      }
      //Create the parent and add the children
      table.push(<tr>{children}</tr>)
    }
    return table
  }

  createTable2() {
    let table = []
    // Outer loop to create parent (i is # of rows)
    for (let i = 0; i < 10; i++) {
      let children = []
      //Inner loop to create children (j is # of columns)
      for (let j = 0; j < 10; j++) {
        let htmlElement = <td >{[`[${j + 1}]`]}</td>
        children.push(htmlElement)
      }
      //Create the parent and add the children
      table.push(<tr>{children}</tr>)
    }
    return table
  }


  render() {
    return(
      <div className='board'>
        <table className='grid player-one'> {this.createTable1()} </table>
        <table className='grid player-two'> {this.createTable2()} </table>
      </div>
    )
  }
}

export default Gameboard;