'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KendaraanSchema extends Schema {
  up() {
    this.create('kendaraans', (table) => {
      table.increments('id_kendaraan')
      table.string('kendaraan_nopol', 10).notNullable()
      table.integer('id_merk_kendaraan')
        .unsigned()
        .references('id_merk_kendaraan')
        .inTable('merk_kendaraans')
        .onDelete('SET NULL')
      table.integer('id_tipe_kendaraan')
        .unsigned()
        .references('id_tipe_kendaraan')
        .inTable('tipe_kendaraans')
        .onDelete('SET NULL')
      table.integer('kendaraan_tahun').notNullable()
      table.string("kendaraan_no_rangka", 20)
      table.string("kendaraan_no_mesin", 20)
      table.boolean("kendaraan_utama").defaultTo(false)
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('kendaraans')
  }
}

module.exports = KendaraanSchema
