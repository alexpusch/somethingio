import {Socket} from "phoenix"

function reserveRoom() {
  return fetch('/rooms/reserve', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  }).then(response => response.json())
}

function connectToRoom(room) {
  let socket = new Socket('/socket', {params: {player_name: "Player"}})
  socket.connect()

  let channelName = `room:${room.id}`
  let channel = socket.channel(channelName, {})

  return new Promise((resolve, reject) => {
    console.log('connecting to room', room, channelName)

    channel.join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp)
        resolve([channel, room])
      })
      .receive("error", resp => {
        console.log("Unable to join", resp)
        reject(resp)
      })
  })
}

function connect() {
  return reserveRoom()
    .then(connectToRoom)
    .then( ([channel, room]) => new Network(channel, room))
}

class Network {
  constructor(channel, room) {
    this.channel = channel
    this.room = room
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

  registerMoueClickCallback(callback) {
    this.channel.on("mouse_click", payload => {
      console.log('got mouse click')
      let [player_id, score] = payload.body
      callback(player_id, score)
    })
  }
}

export default {connect}
