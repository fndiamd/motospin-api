'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TipeServiceSchema extends Schema {
  up() {
    this.create('tipe_services', (table) => {
      table.increments('id_tipe_service')
      table.string('tipe_service', 100)
      table.integer('id_jenis_service')
        .unsigned()
        .references('id_jenis_service')
        .inTable('jenis_services')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('tipe_services')
  }
}

module.exports = TipeServiceSchema
