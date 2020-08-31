const Route = use('Route')

Route.group(() => {
    Route.get('index', 'OrderProdukController.userOrder')
    Route.post('store', 'OrderProdukController.store')
    Route.delete('delete/:id', 'OrderProdukController.delete')
    Route.put('cancel/:id', 'OrderProdukController.userCancelOrder')
}).prefix('api/v1/order-produk/user').middleware(['auth:user'])

Route.group(() => {
    Route.put('cancel/:id', 'OrderProdukController.outletCancelOrder')
    Route.get('index', 'OrderProdukController.outletOrder')
}).prefix('api/v1/order-produk/outlet').middleware(['auth:owner,pegawai,admin'])