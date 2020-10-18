const Route = use('Route')

Route.group(() => {
    Route.get('index', 'ProdukController.index')
    Route.get('view/:id', 'ProdukController.view')
    Route.post('search-name', 'ProdukController.searchName')
    Route.get('produk-outlet', 'ProdukController.produkOutlet')
    Route.post('filter', 'ProdukController.filterProduk')
}).prefix('api/v1/produk')

Route.group(() => {
    Route.get('recommended-sparepart', 'ProdukController.recommendProduct')
}).prefix('api/v1/produk').middleware(['auth:user'])

Route.group(() => {
    Route.post('store', 'ProdukController.store')
    Route.post('import', 'ProdukController.importProduk')
    Route.put('update/:id', 'ProdukController.updateProduct')
    Route.delete('delete/:id', 'ProdukController.delete')
}).prefix('api/v1/produk').middleware(['auth:owner,admin'])