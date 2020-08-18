'use strict'

/*
|--------------------------------------------------------------------------
| TipeServiceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const TipeService = use('App/Models/TipeService')
class TipeServiceSeeder {
  async run () {
    const data = [
      {
        tipe_service: 'Pengecekan Kondisi AC',
        id_jenis_service: 1
      },
      {
        tipe_service: 'Perbaikan AC',
        id_jenis_service: 1
      },
      {
        tipe_service: 'Pengecekan Kondisi Ban',
        id_jenis_service: 2
      },
      {
        tipe_service: 'Ganti Ban',
        id_jenis_service: 2
      },
      {
        tipe_service: 'Spooring',
        id_jenis_service: 2
      },
      {
        tipe_service: 'Balancing',
        id_jenis_service: 2
      },
      {
        tipe_service: 'Pengecekan Kondisi Aki/Accu',
        id_jenis_service: 3
      },
      {
        tipe_service: 'Ganti Aki/Accu',
        id_jenis_service: 3
      },
      {
        tipe_service: 'Pengecekan Kondisi Mesin',
        id_jenis_service: 4
      },
      {
        tipe_service: 'Tune Up',
        id_jenis_service: 4
      },
      {
        tipe_service: 'Perbaikan Mesin',
        id_jenis_service: 4
      },
      {
        tipe_service: 'Pengecekan Kondisi Transmisi',
        id_jenis_service: 5
      },
      {
        tipe_service: 'Pengecekan Kondisi Kopling',
        id_jenis_service: 5
      },
      {
        tipe_service: 'Perbaikan Transmisi',
        id_jenis_service: 5
      },
      {
        tipe_service: 'Perbaikan Kopling',
        id_jenis_service: 5
      },
      {
        tipe_service: 'Pengecekan Kondisi Rem',
        id_jenis_service: 6
      },
      {
        tipe_service: 'Perbaikan Rem',
        id_jenis_service: 6
      },
      {
        tipe_service: 'Ganti Rem',
        id_jenis_service: 6
      },
      {
        tipe_service: 'Pengecekan Kondisi Suspensi',
        id_jenis_service: 7
      },
      {
        tipe_service: 'Perbaikan Suspensi',
        id_jenis_service: 7
      },
      {
        tipe_service: 'Ganti Suspensi',
        id_jenis_service: 7
      },
      {
        tipe_service: 'Pengecekan Kondisi Steering',
        id_jenis_service: 7
      },
      {
        tipe_service: 'Perbaikan Steering',
        id_jenis_service: 7
      },
      {
        tipe_service: 'Ganti Steering',
        id_jenis_service: 7
      },
      {
        tipe_service: 'Pengecekan Kondisi Oli',
        id_jenis_service: 8
      },
      {
        tipe_service: 'Ganti Oli',
        id_jenis_service: 8
      },
      {
        tipe_service: 'Tambah Oli',
        id_jenis_service: 8
      },
      {
        tipe_service: 'Pengecekan Masalah Umum',
        id_jenis_service: 9
      },
      {
        tipe_service: 'Service Berkala',
        id_jenis_service: 9
      }
    ]
  }
}

module.exports = TipeServiceSeeder
