'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KendaraanSchema extends Schema {
  up () {
    this.create('kendaraans', (table) => {
      table.increments('id_kendaraan')
      table.string('kendaraan_nopol', 10).notNullable()
      table.string('kendaraan_merk', 50).notNullable()
      table.string('kendaraan_tipe', 50).notNullable()
      table.integer('kendaraan_tahun').notNullable()
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('kendaraans')
  }
}

module.exports = KendaraanSchema
