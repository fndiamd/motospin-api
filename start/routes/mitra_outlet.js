const Route = use('Route')

// Common Route
Route.group(() => {
    Route.get('/index/:page', 'MitraOutletController.index')
    Route.get('/view/:id', 'MitraOutletController.view')
}).prefix('api/v1/mitra-outlet')

Route.group(() => {
    Route.get('/my-outlets/:page', 'MitraOutletController.myOutlets')
    Route.post('/store', 'MitraOutletController.store')
    Route.put('/update/:id', 'MitraOutletController.update')
    Route.delete('/delete/:id', 'MitraOutletController.delete')
}).prefix('api/v1/mitra-outlet').middleware(['auth:owner'])
