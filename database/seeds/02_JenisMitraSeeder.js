'use strict'

/*
|--------------------------------------------------------------------------
| JenisMitraSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Env = use('Env')
const JenisMitra = use('App/Models/JenisMitra')

class JenisMitraSeeder {
  async run () {
    const data = [
      {
        id_jenis_mitra: 1,
        jenis_mitra: 'Bengkel',
        jenis_mitra_img_path: `${Env.get('APP_URL')}/api/v1/jenis-mitra/img-url/bengkel128.png`
      },
      {
        id_jenis_mitra: 2,
        jenis_mitra: 'Sparepart',
        jenis_mitra_img_path: `${Env.get('APP_URL')}/api/v1/jenis-mitra/img-url/sparepart128.png`
      },
      {
        id_jenis_mitra: 3,
        jenis_mitra: 'Rental Mobil',
        jenis_mitra_img_path: `${Env.get('APP_URL')}/api/v1/jenis-mitra/img-url/mobel128.png`
      },
      {
        id_jenis_mitra: 4,
        jenis_mitra: 'Towing',
        jenis_mitra_img_path: `${Env.get('APP_URL')}/api/v1/jenis-mitra/img-url/tow128.png`
      }
    ]

    await JenisMitra.createMany(data)
  }
}

module.exports = JenisMitraSeeder
