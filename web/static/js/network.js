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
    console.log('sending mouse click', score)
    this.channel.push('mouse_click', {score})
  }

  registerMousePositionsCallback(callback) {
    this.channel.on("mouse_move", payload => {
      let [player_id, x, y] = payload.body
      callback(player_id, x, y)
    })
  }

  registerMouseClickCallback(callback) {
    this.channel.on("mouse_click", payload => {
      console.log('got mouse click')
      let [player_id, score] = payload.body
      callback(player_id, score)
    })
  }

  registerNewPlayerCallback(callback) {
    this.channel.on("new_player", payload => {
      console.log('got new player', payload)
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
  let socket = new Socket('/socket', {params: playerParams})
  socket.connect()

  let channelName = `room:${room.id}`
  let channel = socket.channel(channelName, {})

  return new Promise((resolve, reject) => {
    console.log('connecting to room', room, channelName)

    channel.join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp)
        resolve([channel, room, resp])
      })
      .receive("error", resp => {
        console.log("Unable to join", resp)
        reject(resp)
      })
  })
}

export default Network
