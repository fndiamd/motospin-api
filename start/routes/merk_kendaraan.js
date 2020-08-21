const Route = use('Route')

Route.group(() => {
    Route.get('index', 'MerkKendaraanController.index')
    Route.get('view/:id', 'MerkKendaraanController.view')
    Route.get('all', 'MerkKendaraanController.getAll')
    Route.get('/img-url/:file', 'MerkKendaraanController.image_path')
}).prefix('api/v1/merk-kendaraan')

Route.group(() => {
    Route.post('store', 'MerkKendaraanController.store')
    Route.put('update/:id', 'MerkKendaraanController.update')
    Route.delete('delete/:id', 'MerkKendaraanController.delete')
}).prefix('api/v1/merk-kendaraan').middleware(['auth:admin'])