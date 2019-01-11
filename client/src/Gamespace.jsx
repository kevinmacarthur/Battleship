import React, {Component} from 'react';

class Gamespace extends Component {

  constructor(props) {
    super()
    this.state = {
      coordinate: props.coordinate,
      status: ""
    }
    this.handleClick= this.handleClick.bind(this)
  }

  handleClick(e) {
    console.log("clicked", e.target.attributes.coordinate.value, 'belonging to', e.target.attributes.player.value)
  }

  render() {
    return (
      <input player={this.props.player} coordinate={this.state.coordinate} className='cell' value={this.state.status} onClick={this.handleClick}></input>
      )
  }
}

export default Gamespace;