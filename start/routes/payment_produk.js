const Route = use('Route')

Route.group(() => {
    Route.post('charge', 'PaymentProdukController.charge')
}).prefix('api/v1/payment-produk').middleware(['auth:user'])