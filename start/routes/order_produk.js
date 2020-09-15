const Route = use('Route')

Route.group(() => {
    Route.get('index', 'OrderProdukController.userOrder')
    Route.get('histori', 'OrderProdukController.userOrderHistory')
    Route.post('store', 'OrderProdukController.store')
    Route.delete('delete/:id', 'OrderProdukController.delete')
    Route.put('cancel/:id', 'OrderProdukController.userCancelOrder')
}).prefix('api/v1/order-produk/user').middleware(['auth:user'])

Route.group(() => {
    Route.get('histori', 'OrderProdukController.outletOrderHistory')
    Route.put('cancel/:id', 'OrderProdukController.outletCancelOrder')
    Route.get('index', 'OrderProdukController.outletOrder')
}).prefix('api/v1/order-produk/outlet').middleware(['auth:owner,admin'])