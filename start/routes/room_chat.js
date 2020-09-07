const Route = use('Route')

Route.group(() => {
    Route.post('', 'RoomChatController.store')

    Route.get(':id', 'RoomChatController.select')
    Route.post(':id', 'RoomChatController.createMessage')
}).prefix('/api/v1/room-chat').middleware(['auth:user,owner'])