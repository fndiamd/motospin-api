'use strict'

const { get, route, group } = require('@adonisjs/framework/src/Route/Manager')

const Route = use('Route')

require('./routes/user')
require('./routes/owner')
require('./routes/pegawai')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.get('/mitra-owner', 'MitraOwnerController.index')
  Route.post('/mitra-owner', 'MitraOwnerController.store')
}).prefix('api/v1').middleware(['auth:user'])


