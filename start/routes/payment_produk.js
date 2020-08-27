const Route = use('Route')

Route.group(() => {
    Route.post('charge', 'PaymentProdukController.charge')
    
}).prefix('api/v1/payment-produk').middleware(['auth:user'])

Route.group(() => {
    Route.post('notification', 'PaymentProdukController.notification')
    Route.get('finish', 'PaymentProdukController.finish')
    Route.post('unfinish', 'PaymentProdukController.unfinish')
    Route.post('error', 'PaymentProdukController.error')
}).prefix('api/v1/payment-produk')