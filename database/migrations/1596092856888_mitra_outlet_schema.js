'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MitraOutletSchema extends Schema {
  up () {
    this.create('mitra_outlets', (table) => {
      table.increments('id_mitra')
      table.string('mitra_nama', 150).notNullable()
      table.string('mitra_telp', 15).notNullable().unique()
      table.text('mitra_alamat').notNullable()
      table.string('mitra_long', 50).notNullable()
      table.string('mitra_lat', 50).notNullable()
      table.integer('mitra_status')
      table.integer('id_jenis_mitra')
        .unsigned()
        .references('id_jenis_mitra')
        .inTable('jenis_mitras')
        .onUpdate('CASCADE')
      table.integer('id_owner')
        .unsigned()
        .references('id_owner')
        .inTable('mitra_owners')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('mitra_outlets')
  }
}

module.exports = MitraOutletSchema
