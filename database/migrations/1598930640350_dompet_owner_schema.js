'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DompetOwnerSchema extends Schema {
  up() {
    this.create('dompet_owners', (table) => {
      table.increments('id_dompet')
      table.string('tipe_saldo').notNullable()
      table.integer('saldo').defaultTo(0)
      table.integer('id_owner')
        .unsigned()
        .references('id_owner')
        .inTable('mitra_owners')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('dompet_owners')
  }
}

module.exports = DompetOwnerSchema
