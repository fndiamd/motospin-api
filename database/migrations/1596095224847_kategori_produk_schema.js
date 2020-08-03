'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KategoriProdukSchema extends Schema {
  up () {
    this.create('kategori_produks', (table) => {
      table.increments('id_kategori_produk')
      table.string('kategori_produk', 100).notNullable()
      table.integer('kategori_status')
      table.integer('id_mitra')
        .unsigned()
        .references('id_mitra')
        .inTable('mitra_outlets')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('kategori_produks')
  }
}

module.exports = KategoriProdukSchema
