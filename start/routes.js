'use strict'

const { get, route, group } = require('@adonisjs/framework/src/Route/Manager')

const Route = use('Route')

require('./routes/user')
require('./routes/owner')
require('./routes/pegawai')
require('./routes/mitra_outlet')
require('./routes/kendaraan')
require('./routes/jenis_mitra')
require('./routes/kategori')
require('./routes/merk')
require('./routes/produk')
require('./routes/merk_kendaraan')
require('./routes/tipe_kendaraan')
require('./routes/gambar_produk')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})



