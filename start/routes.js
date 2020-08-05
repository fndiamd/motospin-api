'use strict'

const { get, route, group } = require('@adonisjs/framework/src/Route/Manager')

const Route = use('Route')

require('./routes/user')
require('./routes/owner')
require('./routes/pegawai')
require('./routes/mitra_outlet')
require('./routes/kendaraan')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.get('/cek', 'KendaraanController.index')


