'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KeranjangProdukSchema extends Schema {
  up () {
    this.create('keranjang_produks', (table) => {
      table.increments('id_keranjang_produk')
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('id_produk')
        .unsigned()
        .references('id_produk')
        .inTable('produks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('jumlah')
      table.timestamps()
    })
  }

  down () {
    this.drop('keranjang_produks')
  }
}

module.exports = KeranjangProdukSchema
