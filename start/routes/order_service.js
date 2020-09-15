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
    Route.post('accept-order/:id', 'OrderServiceController.acceptOrder')
    Route.post('decline-order/:id', 'OrderServiceController.declineOrder')
    Route.post('finish-order/:id', 'OrderServiceController.finishOrder')
}).prefix('api/v1/order-service/outlet').middleware(['auth:owner,admin'])