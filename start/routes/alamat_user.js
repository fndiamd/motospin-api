const Route = use('Route')

Route.group(() => {
    Route.get('index', 'AlamatUserController.index')
    Route.post('store', 'AlamatUserController.store')
    Route.get('view/:id', 'AlamatUserController.view')
    Route.put('update/:id', 'AlamatUserController.update')
    Route.delete('delete/:id', 'AlamatUserController.delete')
    Route.put('change-primary/:id', 'AlamatUserController.changePrimary')
}).prefix('api/v1/alamat-user').middleware('auth:user')