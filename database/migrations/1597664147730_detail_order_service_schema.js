'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DetailOrderServiceSchema extends Schema {
  up() {
    this.create('detail_order_services', (table) => {
      table.increments('id_detail_order_service')
      table.integer('id_order_service')
        .unsigned()
        .references('id_order_service')
        .inTable('order_services')
        .onDelete('CASCADE')
      table.integer('id_tipe_service')
        .unsigned()
        .references('id_tipe_service')
        .inTable('tipe_services')
        .onDelete('CASCADE')
      table.integer('detail_order_harga')
      table.text('detail_catatan_user')
      table.text('detail_catatan_outlet')
      table.timestamps()
    })
  }

  down() {
    this.drop('detail_order_services')
  }
}

module.exports = DetailOrderServiceSchema
