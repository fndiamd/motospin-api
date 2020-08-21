'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdminSchema extends Schema {
  up () {
    this.create('admins', (table) => {
      table.increments('id_admin')
      table.string('admin_nama', 100).notNullable()
      table.string('admin_email', 100).unique().notNullable()
      table.string('admin_password', 200).notNullable()
      table.integer('admin_level')
      table.timestamps()
    })
  }

  down () {
    this.drop('admins')
  }
}

module.exports = AdminSchema
