const Route = use('Route')

Route.group(() => {
    Route.get('index', 'OrderProdukController.userOrder')
    Route.post('store', 'OrderProdukController.store')
    Route.delete('delete/:id', 'OrderProdukController.delete')
}).prefix('api/v1/order-produk/user').middleware(['auth:user'])