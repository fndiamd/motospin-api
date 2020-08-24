const Route = use('Route')

Route.group(() => {
    Route.get('index', 'KendaraanController.index')
    Route.get('view/:id', 'KendaraanController.view')
    Route.post('store', 'KendaraanController.store')
    Route.put('update/:id', 'KendaraanController.update')
    Route.delete('delete/:id', 'KendaraanController.delete')
    Route.post('change-primary/:id', 'KendaraanController.swapPrimaryCar')
    Route.get('primary-car', 'KendaraanController.getPrimaryCar')
}).prefix('api/v1/kendaraan').middleware(['auth:user,admin'])