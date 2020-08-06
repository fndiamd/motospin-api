const Route = use('Route')

Route.group(() => {
    Route.get('index/:page', 'KategoriController.index')
    Route.get('view/:id', 'KategoriController.view')
    Route.post('store', 'KategoriController.store')
    Route.put('update/:id', 'KategoriController.update')
    Route.delete('delete/:id', 'KategoriController.delete')
}).prefix('api/v1/kategori-produk').middleware(['auth:owner, pegawai'])