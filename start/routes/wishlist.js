const Route = use('Route')

Route.group(() => {
    Route.get('/', 'WishlistProdukController.index')
    Route.post('add', 'WishlistProdukController.store')
    Route.delete('delete', 'WishlistProdukController.delete')
}).prefix('api/v1/wishlist').middleware(['auth:user'])