class Game {
  constructor(container, events) {
    this.container = container
    this.cursors = {}
    this.cursorsUI = {}
    this.score = 0
    this.events = events;
  }

  start() {
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.container.addEventListener('click', this.handleMouseClick.bind(this))

    let containerOrigin = this.container.getBoundingClientRect()
    this.originX = containerOrigin.left
    this.originY = containerOrigin.top
  }

  updateCursor(playerId, x, y) {
    let cursor = this.cursors[playerId]

    if(!cursor) {
      this.cursors[playerId] = cursor = {id: playerId}
    }

    cursor.x = x
    cursor.y = y

    this.updateCursorUI(cursor)
  }

  updateCursorUI(cursor) {
    let {id, x, y} = cursor
    let cursorUI = this.cursorsUI[id]

    if(!cursorUI) {
      cursorUI = this.cursorsUI[id] = document.createElement('div')
      cursorUI.className = 'cursor cursor--other'
      cursorUI.style.position = 'absolute'
      this.container.appendChild(cursorUI)
    }

    cursorUI.style.top = `${y}px`
    cursorUI.style.left = `${x}px`
  }

  updateScore(playerId, score) {
    console.log(`player ${playerId} has score ${score}`)
  }

  handleMouseMove(event) {
    let x = event.clientX - this.originX, y = event.clientY - this.originY

    this.updateCursor('me', x, y)
    this.events.onMouseMove(x,y)
  }

  handleMouseClick(event) {
    this.score++
    this.events.onMouseClick(this.score)
  }
}

export default Game
