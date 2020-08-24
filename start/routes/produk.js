const Route = use('Route')

Route.group(() => {
    Route.get('index', 'ProdukController.index')
    Route.get('view/:id', 'ProdukController.view')
    Route.post('coba', 'ProdukController.storeCompatibleProduct')
}).prefix('api/v1/produk')

Route.group(() => {
    Route.get('recommended-sparepart', 'ProdukController.recommendProduct')
}).prefix('api/v1/produk').middleware(['auth:user'])

Route.group(() => {
    Route.get('own-produk', 'ProdukController.ownProduk')
    Route.post('store', 'ProdukController.store')
    Route.put('update/:id', 'ProdukController.update')
    Route.delete('delete/:id', 'ProdukController.delete')
}).prefix('api/v1/produk').middleware(['auth:owner,pegawai,admin'])