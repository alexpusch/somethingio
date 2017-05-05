import {Socket} from "phoenix"

class Network {
  constructor(socketUrl) {
    this.socketUrl = socketUrl
  }

  connect(playerParams) {
    return new Promise((resolve, reject) => {
      return reserveRoom()
        .then(connectToRoom.bind(null, playerParams))
        .then( ([channel, room, response]) => {
          this.channel = channel
          this.room = room

          resolve(response)
        }).catch(reject)
    })
  }

  sendMousePosition(x, y) {
    this.channel.push('mouse_move', {x, y})
  }

  sendMouseClick(score) {
    this.channel.push('mouse_click', {score})
  }

  registerMousePositionsCallback(callback) {
    this.channel.on("mouse_move", payload => {
      const [player_id, x, y] = payload.body
      callback(player_id, x, y)
    })
  }

  registerMouseClickCallback(callback) {
    this.channel.on("mouse_click", payload => {
      const [player_id, score] = payload.body
      callback(player_id, score)
    })
  }

  registerNewPlayerCallback(callback) {
    this.channel.on("new_player", payload => {
      const [id, name, score] = payload.body
      callback({id, name, score})
    })
  }
}

function reserveRoom() {
  return fetch('/rooms/reserve', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  }).then(response => response.json())
}

function connectToRoom(playerParams, room) {
  const socket = new Socket('/socket', {params: playerParams})
  socket.connect()

  const channelName = `room:${room.id}`
  const channel = socket.channel(channelName, {})

  return new Promise((resolve, reject) => {
    channel.join()
      .receive("ok", resp => {
        resolve([channel, room, resp])
      })
      .receive("error", resp => {
        reject(resp)
      })
  })
}

export default Network
