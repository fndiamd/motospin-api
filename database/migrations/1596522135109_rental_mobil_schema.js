'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RentalMobilSchema extends Schema {
  up() {
    this.create('rental_mobils', (table) => {
      table.string('rental_nopol').primary()
      table.string('kendaraan_merk', 50).notNullable()
      table.string('kendaraan_tipe', 50).notNullable()
      table.integer('kendaraan_tahun').notNullable()
      table.string('kendaraan_warna', 20).notNullable()
      table.integer('rental_status').defaultTo(0)
      table.integer('id_mitra')
        .unsigned()
        .references('id_mitra')
        .inTable('mitra_outlets')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('rental_mobils')
  }
}

module.exports = RentalMobilSchema
