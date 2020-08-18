'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KendaraanUserSchema extends Schema {
  up() {
    this.create('kendaraan_users', (table) => {
      table.increments('id_kendaraan_user')
      table.string('kendaraan_user_nopol', 10).notNullable()
      table.integer('kendaraan_user_tahun').notNullable()
      table.string('kendaraan_user_warna', 25).notNullable()
      table.integer('kendaraan_user_transmisi').notNullable()
      table.string("kendaraan_user_no_rangka", 20)
      table.string("kendaraan_user_no_mesin", 20)
      table.boolean("kendaraan_utama").defaultTo(false)
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
    this.drop('kendaraan_users')
  }
}

module.exports = KendaraanUserSchema
