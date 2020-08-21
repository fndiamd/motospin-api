'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FirebaseTokenAdminSchema extends Schema {
  up () {
    this.create('firebase_token_admins', (table) => {
      table.increments()
      table.integer('id_admin')
        .unsigned()
        .references('id_admin')
        .inTable('admins')
        .onDelete('CASCADE')
      table.string('registration_token', 255).notNullable().unique().index()
      table.timestamps()
    })
  }

  down () {
    this.drop('firebase_token_admins')
  }
}

module.exports = FirebaseTokenAdminSchema
