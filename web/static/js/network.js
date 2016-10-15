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
  let socket = new Socket('/socket', {params: {token: window.userToken}})
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
    this.channel.push('mousemove', {body: [this.room.id, x, y]})
  }

  registerMousePositionsCallback(callback) {
    this.channel.on("mousemove", payload => {
      let [id, x, y] = payload.body
      callback(id, x, y)
    })
  }
}

export default {connect}
