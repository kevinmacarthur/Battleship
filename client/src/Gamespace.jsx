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

  componentDidUpdate(prevProps) {
    if (this.props.hasShip === true && prevProps.hasShip === false) {
      this.setState({coordinate: this.state.coordinate, status:"X", style:{backgroundColor: 'green'}})
    }
    if (this.props.hasShip === false && prevProps.hasShip === true) {
      this.setState({coordinate: this.state.coordinate, status:this.props.coordinate, style:{}})
    }
  }

  handleClick(e) {
    // let coordinates = []
    console.log(this.props)
    if(this.props.placingShip) {
      this.props.attemptPlacement(this.props.placingShip, e.target.attributes.coordinate.value)
    } else if (this.props.hasShip) {
      console.log("THIS SQUARE HAS A SHIP IN IT")
    } else {
      // console.log("clicked", e.target.attributes.coordinate.value, 'belonging to', e.target.attributes.player.value)
      this.setState({coordinate: this.state.coordinate, status:"X", style:{backgroundColor: 'red'}}, () => {
        this.props.socket.emit('miss', JSON.stringify(this.state))
      })
    }
  }

  render() {
    return (
      <input player={this.props.player} coordinate={this.state.coordinate} className='cell' value={this.state.status} onClick={this.handleClick} text={this.props.coordinate} style={this.state.style}></input>
      )
  }
}

export default Gamespace;