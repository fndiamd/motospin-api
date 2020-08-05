const Route = use('Route')

// Common Route
Route.group(() => {
    Route.get('/mitra-outlet', 'MitraOutletController.index')
    Route.put('/mitra-outlet/update/:id', 'MitraOutletController.update')
    Route.delete('/mitra-outlet/delete/:id', 'MitraOutletController.delete')
}).prefix('api/v1')
