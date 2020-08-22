const Route = use('Route')

Route.group(() => {
    Route.post('store', 'CartController.store')
    Route.get('index', 'CartController.index')
}).prefix('api/v1/cart').middleware(['auth:user'])