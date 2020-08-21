'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FirebaseTokenPegawaiSchema extends Schema {
  up() {
    this.create('firebase_token_pegawais', (table) => {
      table.increments()
      table.integer('id_pegawai')
        .unsigned()
        .references('id_pegawai')
        .inTable('mitra_pegawais')
        .onDelete('CASCADE')
      table.string('registration_token', 255).notNullable().unique().index()
      table.timestamps()
    })
  }

  down() {
    this.drop('firebase_token_pegawais')
  }
}

module.exports = FirebaseTokenPegawaiSchema
