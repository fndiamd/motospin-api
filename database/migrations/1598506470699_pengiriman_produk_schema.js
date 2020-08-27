'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PengirimanProdukSchema extends Schema {
  up() {
    this.create('pengiriman_produks', (table) => {
      table.increments('id')
      table.string('courier').nullable()
      table.string('courier_service').nullable()
      table.integer('courier_cost').nullable()
      table.string('courier_etd').nullable()
      table.string('nomor_resi').nullable()
      table.integer('id_order_produk')
        .unsigned()
        .references('id_order_produk')
        .inTable('order_produks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('pengiriman_produks')
  }
}

module.exports = PengirimanProdukSchema
