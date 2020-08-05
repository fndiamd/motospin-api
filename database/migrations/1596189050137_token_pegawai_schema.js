'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenPegawaiSchema extends Schema {
  up() {
    this.create('token_pegawais', (table) => {
      table.increments()
      table.integer('pegawai_id')
        .unsigned()
        .references('id_pegawai')
        .inTable('mitra_pegawais')
        .onDelete('CASCADE')
      table.string('token', 255).notNullable().unique().index()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })
  }

  down() {
    this.drop('token_pegawais')
  }
}

module.exports = TokenPegawaiSchema
