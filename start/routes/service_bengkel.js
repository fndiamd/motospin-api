const Route = use('Route')

Route.group(() => {
    Route.get('index', 'ServiceBengkelController.index')
    Route.post('store', 'ServiceBengkelController.store')
    Route.delete('delete/:id', 'ServiceBengkelController.delete')
}).prefix('api/v1/service-bengkel').middleware(['auth:owner,pegawai,admin'])