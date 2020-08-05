'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SewaRentalSchema extends Schema {
  up() {
    this.create('sewa_rentals', (table) => {
      table.increments('id_sewa')
      table.string('kode_sewa').notNullable()
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('id_mitra')
        .unsigned()
        .references('id_mitra')
        .inTable('mitra_outlets')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.double('sewa_durasi')
      table.integer('sewa_harga')
      table.datetime('sewa_tanggal_ambil')
      table.datetime('sewa_tanggal_kembali')
      table.integer('id_rental')
        .unsigned()
        .references('id_rental')
        .inTable('rental_mobils')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('sewa_rentals')
  }
}

module.exports = SewaRentalSchema
