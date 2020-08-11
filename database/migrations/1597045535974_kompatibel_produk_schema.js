'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KompatibelProdukSchema extends Schema {
  up () {
    this.create('kompatibel_produks', (table) => {
      table.increments('id_kompatibel_produk')
      table.integer('id_tipe_kendaraan')
      .unsigned()
      .references('id_tipe_kendaraan')
      .inTable('tipe_kendaraans')
      .onDelete('SET NULL')
      table.integer('id_produk')
      .unsigned()
      .references('id_produk')
      .inTable('produks')
      .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('kompatibel_produks')
  }
}

module.exports = KompatibelProdukSchema
