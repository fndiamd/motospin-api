'use strict'

/*
|--------------------------------------------------------------------------
| ProdukSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ProdukSeeder {
  async run () {
    const data = [
      {
        produk_nama: "",
        produk_stok: 10,
        produk_harga: 12000000,
        produk_berat: 4,
        produk_deskripsi: "",
        id_kategori_produk: 0,
        id_merk_produk: 0,
        id_mitra: 9
      }
    ]
  }
}

module.exports = ProdukSeeder
