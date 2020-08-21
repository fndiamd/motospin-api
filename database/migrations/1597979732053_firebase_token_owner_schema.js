'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FirebaseTokenOwnerSchema extends Schema {
  up() {
    this.create('firebase_token_owners', (table) => {
      table.increments()
      table.integer('id_owner')
        .unsigned()
        .references('id_owner')
        .inTable('mitra_owners')
        .onDelete('CASCADE')
      table.string('registration_token', 255).notNullable().unique().index()
      table.timestamps()
    })
  }

  down() {
    this.drop('firebase_token_owners')
  }
}

module.exports = FirebaseTokenOwnerSchema
