'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TipeKendaraanSchema extends Schema {
  up() {
    this.create('tipe_kendaraans', (table) => {
      table.increments('id_tipe_kendaraan')
      table.integer('id_merk_kendaraan')
        .unsigned()
        .references('id_merk_kendaraan')
        .inTable('merk_kendaraans')
        .onDelete('CASCADE')
      table.string('tipe_kendaraan', 100)
      table.timestamps()
    })
  }

  down() {
    this.drop('tipe_kendaraans')
  }
}

module.exports = TipeKendaraanSchema
