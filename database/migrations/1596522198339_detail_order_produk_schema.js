'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DetailOrderProdukSchema extends Schema {
  up() {
    this.create('detail_order_produks', (table) => {
      table.increments('id_detail_order_produk')
      table.integer('id_order_produk')
        .unsigned()
        .references('id_order_produk')
        .inTable('order_produks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('id_produk')
        .unsigned()
        .references('id_produk')
        .inTable('produks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('jumlah').defaultTo(1)
      table.integer('harga_satuan')
      table.timestamps()
    })
  }

  down() {
    this.drop('detail_order_produks')
  }
}

module.exports = DetailOrderProdukSchema
