'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KodeUserSchema extends Schema {
  up() {
    this.create('kode_users', (table) => {
      table.increments('id_kode_user')
      table.integer('kode').notNullable()
      table.integer('kode_status').defaultTo(0)
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('kode_users')
  }
}

module.exports = KodeUserSchema
