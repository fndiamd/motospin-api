'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenOwnerSchema extends Schema {
  up () {
    this.create('token_owners', (table) => {
      table.increments()
      table.integer('owner_id').unsigned().references('id_owner').inTable('mitra_owners')
      table.string('token', 255).notNullable().unique().index()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('token_owners')
  }
}

module.exports = TokenOwnerSchema
