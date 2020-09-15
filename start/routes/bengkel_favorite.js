const Route = use('Route')

Route.group(() => {
    Route.get('/', 'BengkelFavoriteController.index')
    Route.post('/add', 'BengkelFavoriteController.store')
    Route.delete('/delete', 'BengkelFavoriteController.delete')
}).prefix('api/v1/bengkel-favorite').middleware(['auth:user'])