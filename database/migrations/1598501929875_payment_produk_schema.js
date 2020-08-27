'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaymentProdukSchema extends Schema {
  up() {
    this.create('payment_produks', (table) => {
      table.increments('id')
      table.datetime('transaction_time').notNullable()
      table.string('transaction_status').notNullable().defaultTo('unpaid')
      table.string('transaction_id')
      table.float('transaction_total').notNullable()
      table.string('payment_type')
      table.json('payment_detail')
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
    this.drop('payment_produks')
  }
}

module.exports = PaymentProdukSchema
