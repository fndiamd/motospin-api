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
  async run() {
    const data = [
      {
        owner_nama: 'Bengkel Widhia',
        owner_telp: '0315938701',
        owner_email: 'widhia-bengkel@motospin.id',
        owner_password: 'password',
        owner_status: 1
      },
      {
        owner_nama: 'Bengkel SJM',
        owner_telp: '085100996112',
        owner_email: 'sjm-bengkel@motospin.id',
        owner_password: 'password',
        owner_status: 1
      },
      {
        owner_nama: 'Bengkel Grand Speed',
        owner_telp: '081240550774',
        owner_email: 'grandspeed-bengkel@motospin.id',
        owner_password: 'password',
        owner_status: 1
      },
      {
        owner_nama: 'Bengkel Iwan',
        owner_telp: '085101423119',
        owner_email: 'iwan-bengkel@motospin.id',
        owner_password: 'password',
        owner_status: 1
      },
      {
        owner_nama: 'Bengkel Harvest',
        owner_telp: '0818323439',
        owner_email: 'harvest-bengkel@motospin.id',
        owner_password: 'password',
        owner_status: 1
      },
      {
        owner_nama: 'Bengkel Aji Motor',
        owner_telp: '081231308146',
        owner_email: 'aji-motor@motospin.id',
        owner_password: 'password',
        owner_status: 1
      },
      {
        owner_nama: 'Bengkel Top 7',
        owner_telp: '081232977708',
        owner_email: 'top-seven@motospin.id',
        owner_password: 'password',
        owner_status: 1
      },
      {
        owner_nama: 'Bengkel AW',
        owner_telp: '03177480439',
        owner_email: 'aw-bengkel@motospin.id',
        owner_password: 'password',
        owner_status: 1
      },
      {
        owner_nama: 'Bengkel Cak Gatot',
        owner_telp: '085954376065',
        owner_email: 'cakgatot@motospin.id',
        owner_password: 'password',
        owner_status: 1
      }
    ]

    await Owner.createMany(data)
  }
}

module.exports = MitraOwnerSeeder
