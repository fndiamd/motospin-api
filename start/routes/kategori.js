const Route = use('Route')

Route.group(() => {
    Route.get('all', 'KategoriController.all')
    Route.get('index', 'KategoriController.index')
    Route.get('view/:id', 'KategoriController.view')
    Route.get('/img-url/:file', 'KategoriController.image_path')
}).prefix('api/v1/kategori-produk')

Route.group(() => {
    Route.post('store', 'KategoriController.store')
    Route.put('update/:id', 'KategoriController.update')
    Route.delete('delete/:id', 'KategoriController.delete')
}).prefix('api/v1/kategori-produk').middleware(['auth:admin'])