'use strict'

const uuidv4 = require('uuid/v4')

const Room = use('App/Models/RoomChat')
const Message = use('App/Models/Message')

const { broadcast } = require('../../Utils/socket.utils')

class RoomChatController {

    async select({ params, response }) {
        const room = await Room
            .query()
            .where('uuid', params.id)
            .with('messages')
            .first()

        if (!room) {
            return response.notFound('Room chat tidak tersedia')
        }

        return room
    }


    async store({ request }){
        const data = request.only(['id_user', 'id_owner'])
        const room = new Room()
        const uuid = uuidv4()

        room.uuid = uuid
        room.id_user = data.id_user
        room.id_owner = data.id_owner
        
        await room.save()
        return Room.query().with('user').with('owner').where('uuid', uuid).first()
    }

    async createMessage({ params, request, response }){
        const room = await Room.find(params.id)
        if(!room){
            return response.notFound('Room chat tidak tersedia')
        }

        const data = {
            'sender': request.input('sender'),
            'message': request.input('message'),
            'room_id': params.id
        }

        const message = await room.messages().create(data)
        broadcast(room.uuid, 'room:newMessage', message)
        return message
    }

}

module.exports = RoomChatController
