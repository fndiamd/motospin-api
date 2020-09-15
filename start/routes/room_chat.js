const Route = use('Route')

Route.group(() => {
    Route.post('', 'RoomChatController.store')

    Route.get(':id', 'RoomChatController.select')
    Route.post(':id', 'RoomChatController.createMessage')
    Route.get('user/list', 'RoomChatController.userRoomList')
    Route.get('owner/list', 'RoomChatController.ownerRoomList')
}).prefix('/api/v1/room-chat').middleware(['auth:user,owner'])