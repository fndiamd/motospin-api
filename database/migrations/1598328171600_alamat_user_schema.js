'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlamatUserSchema extends Schema {
  up() {
    this.create('alamat_users', (table) => {
      table.increments('id')
      table.string('alamat').notNullable()
      table.integer('city_id').notNullable()
      table.integer('province_id').notNullable()
      table.string('province').notNullable()
      table.string('type').notNullable()
      table.string('city_name').notNullable()
      table.string('postal_code').notNullable()
      table.boolean('primary').defaultTo(false)
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('alamat_users')
  }
}

module.exports = AlamatUserSchema
