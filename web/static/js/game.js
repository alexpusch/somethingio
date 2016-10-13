class Game {
  constructor(container, events) {
    this.container = container
    this.cursors = {}
    this.cursorsUI = {}
    this.events = events;
  }

  start() {
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this))

    let containerOrigin = this.container.getBoundingClientRect()
    this.originX = containerOrigin.left
    this.originY = containerOrigin.top
  }

  updateCursor(cursorId, x, y) {
    let cursor = this.cursors[cursorId]

    if(!cursor) {
      this.cursors[cursorId] = cursor = {id: cursorId}
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

    console.log('updating cursor ui', id, x, y, cursorUI)
    cursorUI.style.top = `${y}px`
    cursorUI.style.left = `${x}px`
  }

  handleMouseMove(event) {
    let x = event.clientX - this.originX, y = event.clientY - this.originY

    this.updateCursor('me', x, y)
    this.events.onMouseMove(x,y)
  }
}

export default Game
