import React, {Component} from 'react';

class Gamespace extends Component {

  constructor(props) {
    super()
    this.state = {
      coordinate: props.coordinate,
      status: props.coordinate
    }
    this.handleClick= this.handleClick.bind(this)
  }

  handleClick(e) {
    console.log("clicked", e.target.value)
    console.log("e.target is", e.target)
    console.log("bye", e.target.className)
    console.log('cell belongs to', e.target.attributes['player'].value)
  }

  render() {
    return (
      <input player={this.props.player} className='cell' value={this.state.status} onClick={this.handleClick}></input>
      )
  }
}

export default Gamespace;