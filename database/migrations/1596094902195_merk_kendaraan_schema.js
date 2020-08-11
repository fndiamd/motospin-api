'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MerkKendaraanSchema extends Schema {
  up () {
    this.create('merk_kendaraans', (table) => {
      table.increments('id_merk_kendaraan')
      table.string('merk_kendaraan', 100)
      table.timestamps()
    })
  }

  down () {
    this.drop('merk_kendaraans')
  }
}

module.exports = MerkKendaraanSchema
