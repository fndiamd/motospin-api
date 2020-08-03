'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MerkProdukSchema extends Schema {
  up () {
    this.create('merk_produks', (table) => {
      table.increments('id_merk_produk')
      table.string('merk_produk', 100).notNullable()
      table.integer('merk_status')
      table.integer('id_mitra')
        .unsigned()
        .references()
        .inTable('mitra_outlets')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('merk_produks')
  }
}

module.exports = MerkProdukSchema
