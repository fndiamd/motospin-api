const Route = use('Route')

Route.group(() => {
    Route.get('index', 'MerkKendaraanController.index')
    Route.get('view/:id', 'MerkKendaraanController.view')
    Route.post('store', 'MerkKendaraanController.store')
    Route.put('update/:id', 'MerkKendaraanController.update')
    Route.delete('delete/:id', 'MerkKendaraanController.delete')
}).prefix('api/v1/merk-kendaraan')