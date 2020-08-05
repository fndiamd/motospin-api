'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DetailOrderSparepartSchema extends Schema {
  up() {
    this.create('detail_order_spareparts', (table) => {
      table.increments('id_order_detail')
      table.integer('id_order_sparepart')
        .unsigned()
        .references('id_order_sparepart')
        .inTable('order_spareparts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('id_produk')
        .unsigned()
        .references('id_produk')
        .inTable('produks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('jumlah').defaultTo(1)
      table.integer('harga')
      table.timestamps()
    })
  }

  down() {
    this.drop('detail_order_spareparts')
  }
}

module.exports = DetailOrderSparepartSchema
