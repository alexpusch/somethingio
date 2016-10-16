class ScoreBoard {
  render(players) {
    if(!this.el) {
      this.el = document.createElement('div')
      this.el.className = 'scores'
    }

    let html = ''

    for(let i in players) {
      let player = players[i]
      html += renderItem(player)
    }

    this.el.innerHTML = html

    return this.el
  }
}

function renderItem(player) {
  return `
    <div class='scores__player'>
      <div class='scores__player-name'>
        ${player.name}
      </div>
      <div class='scores__player-score'>
        ${player.score}</div>
      </div>
    </div>
  `
}

export default ScoreBoard
