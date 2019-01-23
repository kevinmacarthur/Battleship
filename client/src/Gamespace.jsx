import React, {Component} from 'react';

class Gamespace extends Component {

  constructor(props) {
    super()
    this.state = {
      coordinate: props.coordinate,
      status: props.coordinate,
      style: {}
    }
    this.handleClick= this.handleClick.bind(this)
  }

  ComponentDidMount() {

  }

  handleClick(e) {
    let coordinates = []
    if(this.props.placingShip) {
      // console.log('Placing ship', this.props.placingShip)
      this.props.attemptPlacement(this.props.placingShip, e.target.attributes.coordinate.value)
    } else {
      console.log("clicked", e.target.attributes.coordinate.value, 'belonging to', e.target.attributes.player.value)
      this.setState({coordinate: this.state.coordinate, status:"X", style:{backgroundColor: 'red'}}, () => {
        this.props.socket.emit('miss', JSON.stringify(this.state))
      })
  }

    //MAYBE DEAL WITH THIS ON THE SERVER AS WELL AS SEND BOARD GAME FROM SERVER FOR CONSISTENCY
  }

  render() {
    return (
      <input player={this.props.player} coordinate={this.state.coordinate} className='cell' value={this.state.status} onClick={this.handleClick} text={this.props.coordinate} style={this.state.style}></input>
      )
  }
}

export default Gamespace;