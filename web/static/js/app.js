// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"
import Game from './game.js'
import Network from './network.js'

window.onload = function(){
  let container = document.querySelector('.game-container')

  Network.connect().then((network) => {
    console.log('starting game')
    let game = new Game(container, {
      onMouseMove: network.sendMousePosition.bind(network)
    });

    network.registerMousePositionsCallback(function(id, x, y){
      game.updateCursor(id, x, y)
    })

    console.log('container', container)
    game.start()

    let roomNameContainer = document.querySelector('.game__room-name')
    roomNameContainer.innerHTML = network.room.name
  })
}

