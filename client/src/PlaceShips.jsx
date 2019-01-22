import React, {Component} from 'react';

function PlaceShips ({placingShip}) {

  return (
    <div className='PlaceShips'>
    <button onClick={() => placingShip('Battleship', 5)}> Place Battleship 5 </button>
    <button onClick={() => placingShip('Destroyer', 4)}> Place Destroyer 4 </button>
    <button onClick={() => placingShip('Submarine', 3)}> Place Submarine 3 </button>
    <button onClick={() => placingShip('Sneakyboat', 2)}> Place Sneakyboat 2 </button>
    <button onClick={() => placingShip(2)}> READY </button>
    </div>
    )
}

export default PlaceShips