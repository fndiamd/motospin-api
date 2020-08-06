const Route = use('Route')

Route.group(() => {
    Route.get('index/:page', 'ProdukController.index')
})

Route.group(() => {
    Route.get('view/:id', 'ProdukController.view')
    Route.post('store', 'ProdukController.store')
    Route.put('update/:id', 'ProdukController.update')
    Route.delete('delete/:id', 'ProdukController.delete')
}).prefix('api/v1/produk').middleware(['auth:owner, pegawai'])