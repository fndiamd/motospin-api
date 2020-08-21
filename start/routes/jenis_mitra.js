const Route = use('Route')

Route.group(() => {
    Route.get('index', 'JenisMitraController.index')
    Route.get('view/:id', 'JenisMitraController.view')
    Route.get('/img-url/:file', 'JenisMitraController.image_path')
}).prefix('api/v1/jenis-mitra')

Route.group(() => {
    Route.post('store', 'JenisMitraController.store')
    Route.put('update/:id', 'JenisMitraController.update')
    Route.delete('delete/:id', 'JenisMitraController.delete')
}).prefix('api/v1/jenis-mitra').middleware(['auth:admin'])