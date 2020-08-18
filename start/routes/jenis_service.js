const Route = use('Route')

Route.group(() => {
    Route.get('all', 'JenisServiceController.index')
    Route.get('view/:id', 'JenisServiceController.view')
    Route.post('store', 'JenisServiceController.store')
    Route.put('update/:id', 'JenisServiceController.update')
    Route.delete('delete/:id', 'JenisServiceController.delete')
    Route.get('index', 'JenisServiceController.serviceMitra')
    Route.get('img-url/:file', 'JenisServiceController.image_path')
}).prefix('api/v1/jenis-service')