const Route = use('Route')

Route.group(() => {
    Route.get('index', 'MerkKendaraanController.index')
    Route.get('view/:id', 'MerkKendaraanController.view')
    Route.get('all', 'MerkKendaraanController.getAll')
    Route.post('store', 'MerkKendaraanController.store')
    Route.put('update/:id', 'MerkKendaraanController.update')
    Route.delete('delete/:id', 'MerkKendaraanController.delete')
    Route.get('/img-url/:file',  'MerkKendaraanController.image_path')
}).prefix('api/v1/merk-kendaraan')