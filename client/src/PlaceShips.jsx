import React, {Component} from 'react';

function PlaceShips ({placingShip, player, currentlyPlacingShip}) {

  console.log("currentlyPlacingShip is ", currentlyPlacingShip)

  return (
    <div className='PlaceShips'>
    <button className={currentlyPlacingShip.name === "Battleship" && currentlyPlacingShip.player == player ? "selected" : "button"} onClick={() => placingShip('Battleship', 5, player)}> Place Battleship 5 </button>
    <button className={currentlyPlacingShip.name === "Destroyer" && currentlyPlacingShip.player == player ? "selected" : "button"} onClick={() => placingShip('Destroyer', 4, player)}> Place Destroyer 4 </button>
    <button className={currentlyPlacingShip.name === "Submarine" && currentlyPlacingShip.player == player ? "selected" : "button"} onClick={() => placingShip('Submarine', 3, player)}> Place Submarine 3 </button>
    <button className={currentlyPlacingShip.name === "Sneakyboat" && currentlyPlacingShip.player == player ? "selected" : "button"} onClick={() => placingShip('Sneakyboat', 2, player)}> Place Sneakyboat 2 </button>
    </div>
    )
}

export default PlaceShips