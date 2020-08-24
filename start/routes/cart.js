const Route = use('Route')

Route.group(() => {
    Route.post('store', 'CartController.store')
    Route.get('index', 'CartController.index')
    Route.put('update/:id', 'CartController.update')
    Route.delete('delete/:id', 'CartController.delete')
}).prefix('api/v1/cart').middleware(['auth:user'])