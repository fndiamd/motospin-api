const Route = use('Route')

Route.group(() => {
    Route.get('index', 'OrderServiceController.serviceUser')
    Route.get('histori', 'OrderServiceController.userOrderHistory')
    Route.post('store', 'OrderServiceController.store')
    Route.get('view/:id', 'OrderServiceController.viewOrderUser')
}).prefix('api/v1/order-service/user').middleware(['auth:user'])

Route.group(() => {
    Route.get('index', 'OrderServiceController.serviceOutlet')
    Route.get('histori', 'OrderServiceController.outletOrderHistory')
    Route.put('accept-order/:id', 'OrderServiceController.acceptOrder')
    Route.put('working-order/:id', 'OrderServiceController.workingOrder')
    Route.put('decline-order/:id', 'OrderServiceController.declineOrder')
    Route.put('finish-order/:id', 'OrderServiceController.finishOrder')

    Route.put('detail-order/:id', 'DetailOrderServiceController.update')
}).prefix('api/v1/order-service/outlet').middleware(['auth:owner,admin'])