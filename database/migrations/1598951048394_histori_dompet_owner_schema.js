'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistoriDompetOwnerSchema extends Schema {
  up() {
    this.create('histori_dompet_owners', (table) => {
      table.increments('id_histori')
      table.integer('id_dompet')
        .unsigned()
        .references('id_dompet')
        .inTable('dompet_owners')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.string('kode_transaksi')
      table.integer('nominal_transaksi')
      table.integer('status_transaksi')
      table.timestamps()
    })
  }

  down() {
    this.drop('histori_dompet_owners')
  }
}

module.exports = HistoriDompetOwnerSchema
