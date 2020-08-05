'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RentalHargaSchema extends Schema {
  up() {
    this.create('rental_hargas', (table) => {
      table.increments('id_rental_harga')
      table.integer('id_rental')
        .unsigned()
        .references('id_rental')
        .inTable('rental_mobils')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.double('rental_durasi')
      table.integer('rental_harga')
      table.timestamps()
    })
  }

  down() {
    this.drop('rental_hargas')
  }
}

module.exports = RentalHargaSchema
