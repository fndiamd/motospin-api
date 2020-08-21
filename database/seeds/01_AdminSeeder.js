'use strict'

/*
|--------------------------------------------------------------------------
| AdminSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Admin = use('App/Models/Admin')

class AdminSeeder {
  async run() {
    const data = [
      {
        admin_nama: 'Super Admin',
        admin_email: 'superadmin@motospin.id',
        admin_password: 'krematoriumngarepbengkel',
        admin_level: 1
      },
      {
        admin_nama: 'Fandi Ahmad',
        admin_email: 'fndiamd@motospin.id',
        admin_password: 'krematoriumngarepbengkel',
        admin_level: 1
      },
      {
        admin_nama: 'Angga Pradipta',
        admin_email: 'angga@motospin.id',
        admin_password: 'krematoriumngarepbengkel',
        admin_level: 1
      },
    ]

    await Admin.createMany(data)
  }
}

module.exports = AdminSeeder
