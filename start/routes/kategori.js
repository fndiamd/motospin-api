const Route = use('Route')

Route.get('api/v1/kategori-produk/all', 'KategoriController.all')

Route.group(() => {
    Route.get('index', 'KategoriController.index')
    Route.get('view/:id', 'KategoriController.view')
    Route.post('store', 'KategoriController.store')
    Route.put('update/:id', 'KategoriController.update')
    Route.delete('delete/:id', 'KategoriController.delete')
    Route.get('/img-url/:file',  'KategoriController.image_path')
}).prefix('api/v1/kategori-produk')