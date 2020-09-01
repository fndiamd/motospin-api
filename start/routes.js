'use strict'

const { get, route, group } = require('@adonisjs/framework/src/Route/Manager')

const Route = use('Route')

require('./routes/admin')
require('./routes/user')
require('./routes/owner')
require('./routes/mitra_outlet')
require('./routes/kendaraan')
require('./routes/jenis_mitra')
require('./routes/kategori')
require('./routes/merk')
require('./routes/produk')
require('./routes/merk_kendaraan')
require('./routes/tipe_kendaraan')
require('./routes/gambar_produk')
require('./routes/jenis_service')
require('./routes/service_bengkel')
require('./routes/order_service')
require('./routes/cart')
require('./routes/order_produk')
require('./routes/raja_ongkir')
require('./routes/alamat_user')
require('./routes/payment_produk')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})



