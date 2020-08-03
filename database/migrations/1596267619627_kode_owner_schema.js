'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KodeOwnerSchema extends Schema {
  up () {
    this.create('kode_owners', (table) => {
      table.increments('id_kode_owner')
      table.integer('kode').notNullable()
      table.integer('kode_status').defaultTo(0)
      table.integer('id_owner')
        .unsigned()
        .references('id_owner')
        .inTable('mitra_owners')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('kode_owners')
  }
}

module.exports = KodeOwnerSchema
