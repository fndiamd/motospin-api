'use strict'

/*
|--------------------------------------------------------------------------
| KategoriSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Env = use('Env')
const Kategori = use('App/Models/KategoriProduk')

class KategoriSeeder {
  async run () {
    const data = [
      {
        kategori_produk: 'Mesin',
        kategori_img_path: `${Env.get('APP_URL')}/api/v1/kategori-produk/img-url/Engineicon.png`,
        kategori_status: 1
      },
      {
        kategori_produk: 'Exterior',
        kategori_img_path: `${Env.get('APP_URL')}/api/v1/kategori-produk/img-url/Exterioricon.png`,
        kategori_status: 1
      },
      {
        kategori_produk: 'Interior',
        kategori_img_path: `${Env.get('APP_URL')}/api/v1/kategori-produk/img-url/Interioricon.png`,
        kategori_status: 1
      },
      {
        kategori_produk: 'Understeel',
        kategori_img_path: `${Env.get('APP_URL')}/api/v1/kategori-produk/img-url/Understeelicon.png`,
        kategori_status: 1
      },
      {
        kategori_produk: 'Roda',
        kategori_img_path: `${Env.get('APP_URL')}/api/v1/kategori-produk/img-url/Wheelicon.png`,
        kategori_status: 1
      }
    ]

    await Kategori.createMany(data)
  }
}

module.exports = KategoriSeeder
