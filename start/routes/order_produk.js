const Route = use('Route')

Route.group(() => {
    Route.get('index', 'OrderProdukController.userOrder')
    Route.post('store', 'OrderProdukController.store')
}).prefix('api/v1/order-produk/user').middleware(['auth:user'])