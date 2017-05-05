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
import ScoreBoard from './score_board.js'
import generateName from './name_generator.js'

window.onload = function(){
  const container = document.querySelector('.game-container')
  const playerName = generateName()

  const network = new Network('/socket')

  network.connect({player_name: playerName}).then((response) => {
    const currentPlayers = response.current_players

    const roomNameContainer = document.querySelector('.game__room-name')
    roomNameContainer.innerHTML = network.room.name

    const scoreBoard = new ScoreBoard()
    const el = scoreBoard.render(currentPlayers)
    document.querySelector('.game__scores-container').appendChild(el)

    const game = new Game(container, {
      onMouseMove: network.sendMousePosition.bind(network),
      onMouseClick: network.sendMouseClick.bind(network)
    });

    network.registerMousePositionsCallback((id, x, y) => {
      game.updateCursor(id, x, y)
    })

    network.registerMouseClickCallback((id, score) => {
      const player = currentPlayers.filter((p) => p.id == id)[0]
      player.score = score

      scoreBoard.render(currentPlayers)
    })

    game.start()

    network.registerNewPlayerCallback((player) => {
      currentPlayers.push(player)
      scoreBoard.render(currentPlayers)
    })
  })
}

