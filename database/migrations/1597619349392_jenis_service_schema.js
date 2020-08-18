'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class JenisServiceSchema extends Schema {
  up() {
    this.create('jenis_services', (table) => {
      table.increments('id_jenis_service')
      table.string('jenis_service').notNullable()
      table.string('jenis_service_img_path', 200)
      table.integer('id_jenis_mitra')
        .unsigned()
        .references('id_jenis_mitra')
        .inTable('jenis_mitras')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('jenis_services')
  }
}

module.exports = JenisServiceSchema
