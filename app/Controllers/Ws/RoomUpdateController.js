'use strict'

class RoomUpdateController {
  constructor({ socket, request, auth}) {
    this.socket = socket
    this.request = request
    this.auth = auth

    console.log('A new subscription for room topic', socket.topic)
  }

  onMessage(message){
    console.log('got message', message)
    console.log('hitt')
  }

  onClose(){
    console.log('Closing subscription for room topic', this.socket.topic)
  }
}

module.exports = RoomUpdateController
