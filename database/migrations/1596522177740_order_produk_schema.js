'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderProdukSchema extends Schema {
  up() {
    this.create('order_produks', (table) => {
      table.increments('id_order_produk')
      table.datetime('order_tanggal').notNullable()
      table.string('nama_penerima').notNullable()
      table.text('alamat_penerima')
      table.integer('order_total')
      table.integer('order_status').defaultTo(0)
      table.boolean('order_delivery').defaultTo(true)
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('id_mitra')
        .unsigned()
        .references('id_mitra')
        .inTable('mitra_outlets')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('id_pegawai')
        .unsigned()
        .references('id_pegawai')
        .inTable('mitra_pegawais')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down() {
    this.drop('order_produks', (table) => {
      this.drop('order_produks')
    })
  }
}

module.exports = OrderProdukSchema
