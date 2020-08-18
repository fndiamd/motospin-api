'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KeranjangServiceSchema extends Schema {
  up () {
    this.create('keranjang_services', (table) => {
      table.increments('id_keranjang_service')
      table.integer('id_user')
      .unsigned()
      .references('id_user')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table.integer('id_tipe_service')
      .unsigned()
      .references('id_tipe_service')
      .inTable('tipe_services')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('keranjang_services')
  }
}

module.exports = KeranjangServiceSchema
