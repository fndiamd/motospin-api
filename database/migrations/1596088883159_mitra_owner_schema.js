'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MitraOwnerSchema extends Schema {
  up () {
    this.create('mitra_owners', (table) => {
      table.increments('id_owner')
      table.string('owner_nama', 50).notNullable()
      table.string('owner_telp', 15).notNullable().unique()
      table.string('owner_email', 150).unique()
      table.string('owner_password', 200).notNullable()
      table.string('owner_avatar_path', 200)
      table.string('owner_ktp').nullable()
      table.integer('owner_status').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('mitra_owners')
  }
}

module.exports = MitraOwnerSchema
