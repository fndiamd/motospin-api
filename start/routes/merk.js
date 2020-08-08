const Route = use('Route')

Route.group(() => {
    Route.get('index', 'MerkController.index')
    Route.get('view/:id', 'MerkController.view')
    Route.post('store', 'MerkController.store')
    Route.put('update/:id', 'MerkController.update')
    Route.delete('delete/:id', 'MerkController.delete')
}).prefix('api/v1/merk-produk')