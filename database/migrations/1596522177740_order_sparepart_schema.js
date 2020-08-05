'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSparepartSchema extends Schema {
  up() {
    this.create('order_spareparts', (table) => {
      table.increments('id_order_sparepart')
      table.datetime('order_tanggal').notNullable()
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
      table.text('alamat_penerima')
      table.integer('order_total')
      table.integer('order_status').defaultTo(0)
      table.timestamps()
    })
  }

  down() {
    this.drop('order_spareparts', (table) => {
      this.drop('order_spareparts')
    })
  }
}

module.exports = OrderSparepartSchema
