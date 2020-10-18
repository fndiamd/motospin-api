'use strict'

/*
|--------------------------------------------------------------------------
| MerkSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Merk = use('App/Models/MerkProduk')
class MerkSeeder {
  async run() {
    const data = [
      {
        merk_produk: 'Tidak ada merk',
        merk_status: 1
      },
      {
        merk_produk: 'Denso',
        merk_status: 1
      },
      {
        merk_produk: 'Ohlins',
        merk_status: 1
      },
      {
        merk_produk: 'Korteco',
        merk_status: 1
      },
      {
        merk_produk: 'Champion',
        merk_status: 1
      },
      {
        merk_produk: 'NSK',
        merk_status: 1
      },
      {
        merk_produk: 'Fargo',
        merk_status: 1
      },
      {
        merk_produk: 'Hasaki',
        merk_status: 1
      }
    ]

    await Merk.createMany(data)
  }
}

module.exports = MerkSeeder
