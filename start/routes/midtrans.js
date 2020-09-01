const Route = use('Route')

Route.group(() => {
    Route.post('notification', 'MidtransController.notification')
    Route.get('finish', 'MidtransController.finish')
    Route.get('unfinish', 'MidtransController.unfinish')
    Route.get('error', 'MidtransController.error')
}).prefix('api/v1/midtrans')