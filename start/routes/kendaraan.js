const Route = use('Route')

Route.group(() => {
    Route.get('index', 'KendaraanController.index')
    Route.get('view/:id', 'KendaraanController.view')
    Route.post('store', 'KendaraanController.store')
    Route.put('update/:id', 'KendaraanController.update')
    Route.delete('delete/:id', 'KendaraanController.delete')
}).prefix('api/v1/kendaraan').middleware(['auth:user'])