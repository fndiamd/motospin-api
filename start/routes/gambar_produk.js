const Route = use('Route')

Route.group(() => {
    Route.get('img-url/:produk/:file', 'GambarProdukController.image_path')
}).prefix('api/v1/gambar-produk')