const Route = use('Route')

Route.group(() => {
    Route.get('provinsi', 'RajaOngkirController.getProvince')
    Route.get('kota', 'RajaOngkirController.getCity')
}).prefix('api/v1/wilayah')

Route.group(() => {
    Route.post('cek-ongkir', 'RajaOngkirController.calculateCost')
}).prefix('api/v1/raja-ongkir/')