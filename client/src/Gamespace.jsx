import React, {Component} from 'react';

function Gamespace ({coordinate})  {

  function handleClick(e) {
    console.log("clicked", e.target.value)
  }

    return (
      <input value={coordinate} onClick={handleClick}></input>
      )
}

export default Gamespace;