'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceBengkelSchema extends Schema {
  up() {
    this.create('service_bengkels', (table) => {
      table.increments('id_service_bengkel')
      table.integer('id_mitra')
        .unsigned()
        .references('id_mitra')
        .inTable('mitra_outlets')
        .onDelete('CASCADE')
      table.integer('id_jenis_service')
        .unsigned()
        .references('id_jenis_service')
        .inTable('jenis_services')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('service_bengkels')
  }
}

module.exports = ServiceBengkelSchema
