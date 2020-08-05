'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderServiceSchema extends Schema {
  up() {
    this.create('order_services', (table) => {
      table.increments('id_order_service')
      table.datetime('order_tanggal')
      table.string('kendaraan_nopol')
      table.string('kendaraan_merk', 50)
      table.string('kendaraan_tipe', 50)
      table.integer('kendaraan_tahun')
      table.text('order_deskripsi')
      table.integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('id_mitra')
        .unsigned()
        .references('id_mitra')
        .inTable('mitra_outlets')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('id_jenis_layanan')
        .unsigned()
        .references('id_jenis_layanan')
        .inTable('jenis_layanans')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('order_services')
  }
}

module.exports = OrderServiceSchema
