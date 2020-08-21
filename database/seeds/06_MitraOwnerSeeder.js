'use strict'

/*
|--------------------------------------------------------------------------
| MitraOwnerSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Owner = use('App/Models/MitraOwner')

class MitraOwnerSeeder {
  async run () {
    const data = {
      owner_nama: 'Motospin Master',
      owner_telp: '031882991',
      owner_email: 'master@motospin.id',
      owner_password: 'password',
      owner_status: 1
    }

    await Owner.create(data)
  }
}

module.exports = MitraOwnerSeeder
