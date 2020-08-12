'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')

class UserSeeder {
  async run() {
    const data = {
      user_nama: 'Fandi Ahmad',
      user_email: 'fndiamd@gmail.com',
      user_telp: '081234567890',
      user_password: 'password',
      user_ktp: '3515153882991231',
      user_status: 2
    }

    await User.create(data)
  }
}

module.exports = UserSeeder
