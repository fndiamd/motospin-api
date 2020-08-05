'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class JenisLayananSchema extends Schema {
  up () {
    this.create('jenis_layanans', (table) => {
      table.increments('id_jenis_layanan')
      table.string('jenis_layanan', 50).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('jenis_layanans')
  }
}

module.exports = JenisLayananSchema
