'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GambarProdukSchema extends Schema {
  up () {
    this.create('gambar_produks', (table) => {
      table.increments('id_gambar_produk')
      table.integer('id_produk').unsigned().references('id_produk').inTable('produks').onDelete('CASCADE')
      table.string('gambar_url_path', 200)
      table.timestamps()
    })
  }

  down () {
    this.drop('gambar_produks')
  }
}

module.exports = GambarProdukSchema
