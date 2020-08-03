'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments('id_user')
      table.string('user_nama', 50).notNullable()
      table.string('user_email', 150).unique()
      table.string('user_telp', 15).notNullable().unique()
      table.string('user_password', 200).notNullable()
      table.string('user_ktp', 16).unique()
      table.integer('user_status')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
