'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProdukSchema extends Schema {
  up () {
    this.create('produks', (table) => {
      table.increments('id_produk')
      table.string('produk_nama', 200).notNullable()
      table.string('produk_merk_kendaraan', 50).notNullable()
      table.string('produk_tipe_kendaraan', 50).notNullable()
      table.integer('produk_tahun_kendaraan')
      table.integer('produk_stok')
      table.integer('produk_berat')
      table.integer('id_merk_produk')
        .unsigned()
        .references('id_merk_produk')
        .inTable('merk_produks')
        .onUpdate('CASCADE')
      table.integer('id_kategori_produk')
        .unsigned()
        .references('id_kategori_produk')
        .inTable('kategori_produks')
        .onUpdate('CASCADE')
      table.integer('id_mitra')
        .unsigned()
        .references('id_mitra')
        .inTable('mitra_outlets')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('produks')
  }
}

module.exports = ProdukSchema
