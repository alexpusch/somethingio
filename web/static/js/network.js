import {Socket} from "phoenix"

let connect = function(socketUrl, channelName) {
  let socket = new Socket(socketUrl, {params: {token: window.userToken}})
  socket.connect()
  let channel = socket.channel(channelName, {})
  let id;
  let mousePositionCallback

  channel.on("mousemove", payload => {
    let [id, x, y] = payload.body
    mousePositionCallback(id, x, y)
  })

  let Network = {
    sendMousePosition(x, y) {
      channel.push('mousemove', {body: [id, x, y]})
    },

    registerMousePositionsCallback(callback) {
      mousePositionCallback = callback;
    }
  }

  return new Promise((resolve, reject) => {
    channel.join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp)
        id = resp.id
        resolve([id, Network])
      })
      .receive("error", resp => {
        console.log("Unable to join", resp)
        reject(resp)
      })
  })
}

export default {connect}
