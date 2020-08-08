'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KategoriProdukSchema extends Schema {
  up () {
    this.create('kategori_produks', (table) => {
      table.increments('id_kategori_produk')
      table.string('kategori_produk', 100).notNullable()
      table.string('kategori_img_path', 200)
      table.integer('kategori_status').defaultTo(1)
      table.timestamps()
    })
  }

  down () {
    this.drop('kategori_produks')
  }
}

module.exports = KategoriProdukSchema
