'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FirebaseTokenUserSchema extends Schema {
  up() {
    this.create('firebase_token_users', (table) => {
      table.increments()
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('registration_token', 255).notNullable().unique().index()
      table.timestamps()
    })
  }

  down() {
    this.drop('firebase_token_users')
  }
}

module.exports = FirebaseTokenUserSchema
