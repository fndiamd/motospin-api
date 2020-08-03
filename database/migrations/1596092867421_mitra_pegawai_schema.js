'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MitraPegawaiSchema extends Schema {
  up () {
    this.create('mitra_pegawais', (table) => {
      table.increments('id_pegawai')
      table.string('pegawai_nama', 50).notNullable()
      table.string('pegawai_telp', 15).notNullable().unique()
      table.string('pegawai_email', 150).unique()
      table.string('pegawai_password', 200).notNullable()
      table.integer('pegawai_level')
      table.integer('id_mitra')
        .unsigned()
        .references('id_mitra')
        .inTable('mitra_outlets')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('mitra_pegawais')
  }
}

module.exports = MitraPegawaiSchema
