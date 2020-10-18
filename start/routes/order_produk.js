const Route = use('Route')

Route.group(() => {
    Route.get('index', 'OrderProdukController.userOrder')
    Route.get('histori', 'OrderProdukController.userOrderHistory')
    Route.post('store', 'OrderProdukController.store')
    Route.put('cancel/:id', 'OrderProdukController.userCancelOrder')
    Route.put('finish', 'OrderProdukController.userFinishOrder')
}).prefix('api/v1/order-produk/user').middleware(['auth:user'])

Route.group(() => {
    Route.get('histori', 'OrderProdukController.outletOrderHistory')
    Route.put('accept/:id', 'OrderProdukController.acceptOrder')
    Route.put('sending/:id', 'OrderProdukController.sendingOrder')
    Route.put('finish', 'OrderProdukController.outletFinishOrder')
    Route.put('cancel/:id', 'OrderProdukController.outletCancelOrder')
    Route.get('index', 'OrderProdukController.outletOrder')
}).prefix('api/v1/order-produk/outlet').middleware(['auth:owner,admin'])