const Route = use('Route')

Route.group(() => {
    Route.get('/index', 'TipeKendaraanController.index')
    Route.get('/view/:id', 'TipeKendaraanController.view')
    Route.get('/search-by-merk', 'TipeKendaraanController.searchByMerk')
    Route.post('/store', 'TipeKendaraanController.store')
    Route.put('/update/:id', 'TipeKendaraanController.update')
    Route.delete('/delete/:id', 'TipeKendaraanController.delete')
}).prefix('api/v1/tipe-kendaraan')