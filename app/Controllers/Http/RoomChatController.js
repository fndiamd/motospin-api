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
            .with('messages', builder => {
                return builder.orderBy('created_at', 'desc')
            })
            .with('owner')
            .with('user')
            .first()

        if (!room) {
            return response.notFound('Room chat tidak tersedia')
        }

        return room
    }


    async store({ auth, request, response }) {
        const authData = await auth.authenticator('user').getUser()

        const room = new Room()
        const uuid = uuidv4()

        const checkRoomExists = await Room
            .query()
            .where({
                'id_user': authData.id_user,
                'id_owner': request.input('id_owner')
            })
            .first()

        if (checkRoomExists)
            return response.badRequest({ message: 'Room chat sudah ada' })

        room.uuid = uuid
        room.id_user = authData.id_user
        room.id_owner = request.input('id_owner')

        await room.save()
        return Room.query().with('user').with('owner').where('uuid', uuid).first()
    }

    async createMessage({ params, request, response }) {
        const room = await Room.find(params.id)
        if (!room) {
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

    async userRoomList({ auth, response }) {
        const authData = await auth.authenticator('user').getUser()
        const listroom = await Room
            .query()
            .where('id_user', authData.id_user)
            .with('messages', builder => {
                return builder.orderBy('created_at', 'desc').limit(2)
            })
            .with('owner')
            .fetch()
        return response.ok(listroom)
    }

    async ownerRoomList({ auth, response }) {
        const authData = await auth.authenticator('owner').getUser()
        const listroom = await Room
            .query()
            .where('id_owner', authData.id_owner)
            .with('messages', builder => {
                return builder.orderBy('created_at', 'desc')
            })
            .with('user')
            .fetch()
        return response.ok(listroom)
    }

}

module.exports = RoomChatController
